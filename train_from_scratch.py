import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import os
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# -------------------------------------------------------------
# 1. Dataset Construction (Ahyeon + Wonhee Bias Corpus)
# -------------------------------------------------------------
corpus = '''
User: Hey Ahyeon! How was dance practice?
Ahyeon: Hey hey!! We just finished 6 hours in the studio and my feet are on fire ?? But we nailed the choreography, so I'm super hyped! How was your day? ???! ?
User: What do you hate eating?
Ahyeon: Ugh, broccoli is literally my worst enemy. Why would anyone willingly eat tiny green trees? If you want to make me happy, bring me a chocolate bubble tea smoothie instead!
User: I'm really tired tonight...
Ahyeon: *pushes hair back* You worked so hard today! Don't let it stress you out. Eat something delicious and get good sleep, okay? ???, I'm always cheering for you! ??
User: What is your favorite thing?
Ahyeon: Music, drawing, and singing with all my heart. Let's make every single moment count, ??! ??

User: Hi Wonhee! What are you doing right now?
Wonhee: Hii!! *waves excitedly* I was just tidying up my messy room and now I'm craving crunchy garlic bread so bad hehe~ ?? Did you eat dinner yet? ??
User: Wonhee, I am so stressed today.
Wonhee: Oh no... *pouts* Whenever I feel stressed, I eat spicy Buldak noodles or clean my room to clear my head! Don't worry too much, take a deep breath and rest, okay? ????
User: Do you like mint chocolate?
Wonhee: Absolutely not!! No mint chocolate for me, ever! Hehe~ But baked sweet potatoes and corn? Yes please! ???
User: Can you help me study math?
Wonhee: Ehehe math makes my brain spin around in circles~ But I can be your personal cheerleader! You can do it, fighting!! ?
''' * 200  # Duplicate to simulate continuous training stream

# Character-level / Subword Tokenizer
chars = sorted(list(set(corpus)))
vocab_size = len(chars)
stoi = {ch: i for i, ch in enumerate(chars)}
itos = {i: ch for i, ch in enumerate(chars)}
encode = lambda s: [stoi[c] for c in s if c in stoi]
decode = lambda l: ''.join([itos[i] for i in l])

data = torch.tensor(encode(corpus), dtype=torch.long)
n_train = int(0.9 * len(data))
train_data = data[:n_train]
val_data = data[n_train:]

# -------------------------------------------------------------
# 2. Hyperparameters (Sized for i5-3470 & 4GB RAM)
# -------------------------------------------------------------
batch_size = 16
block_size = 64
max_iters = 300
eval_interval = 50
learning_rate = 1e-3
device = 'cpu'
eval_iters = 20
n_embd = 128
n_head = 4
n_layer = 4
dropout = 0.1

torch.set_num_threads(4) # Maximize all 4 physical cores

def get_batch(split):
    d = train_data if split == 'train' else val_data
    ix = torch.randint(len(d) - block_size, (batch_size,))
    x = torch.stack([d[i:i+block_size] for i in ix])
    y = torch.stack([d[i+1:i+block_size+1] for i in ix])
    return x, y

# -------------------------------------------------------------
# 3. Nano-Transformer Architecture (From Scratch)
# -------------------------------------------------------------
class Head(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * (k.shape[-1]**-0.5)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        out = wei @ v
        return out

class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size) for _ in range(num_heads)])
        self.proj = nn.Linear(head_size * num_heads, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.dropout(self.proj(out))
        return out

class FeedForward(nn.Module):
    def __init__(self, n_embd):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.GELU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size)
        self.ffwd = FeedForward(n_embd)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x

class NanoTransformer(nn.Module):
    def __init__(self):
        super().__init__()
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[Block(n_embd, n_head=n_head) for _ in range(n_layer)])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape
        tok_emb = self.token_embedding_table(idx)
        pos_emb = self.position_embedding_table(torch.arange(T, device=device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)

        return logits, loss

    def generate(self, idx, max_new_tokens):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -block_size:]
            logits, loss = self(idx_cond)
            logits = logits[:, -1, :]
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, idx_next), dim=1)
        return idx

# -------------------------------------------------------------
# 4. Execution & Training Loop
# -------------------------------------------------------------
model = NanoTransformer().to(device)
param_count = sum(p.numel() for p in model.parameters())
print(f"[*] Initialized NanoTransformer from RAW RANDOM WEIGHTS.")
print(f"[*] Parameters: {param_count:,} ({param_count*4/(1024*1024):.2f} MB RAM footprint)")
print(f"[*] CPU Cores: 4 Threads pinned @ AVX execution.")
print("="*60)

# Untrained baseline sample
context = torch.zeros((1, 1), dtype=torch.long, device=device)
print("\n[Step 0 Raw Untrained Output (Random Noise)]:")
print(decode(model.generate(context, max_new_tokens=60)[0].tolist()))
print("="*60 + "\n")

optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
start_time = time.time()

for iter in range(max_iters):
    if iter % eval_interval == 0 or iter == max_iters - 1:
        model.eval()
        with torch.no_grad():
            losses = []
            for _ in range(eval_iters):
                X, Y = get_batch('val')
                _, loss = model(X, Y)
                losses.append(loss.item())
            val_loss = sum(losses) / len(losses)
        model.train()
        elapsed = time.time() - start_time
        print(f"Step {iter:3d}/{max_iters} | Val Loss: {val_loss:.4f} | Time: {elapsed:.1f}s")

    xb, yb = get_batch('train')
    logits, loss = model(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

print("\n" + "="*60)
print("[*] Training Complete! Generating text from TRAINED weights:")
print("="*60)
prompt_text = "User: Hey Ahyeon!"
encoded_prompt = torch.tensor(encode(prompt_text), dtype=torch.long, device=device).unsqueeze(0)
generated = decode(model.generate(encoded_prompt, max_new_tokens=150)[0].tolist())
print(generated)

# Save checkpoint
torch.save(model.state_dict(), 'bias_nano_model.pt')
print("\n[*] Saved trained weights to 'bias_nano_model.pt'.")
