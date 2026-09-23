package pk.alicnc.ceo;

public class ChatMessage {
    private final String text;
    private final boolean isUser;
    private final long timestamp;
    private final String badge;

    public ChatMessage(String text, boolean isUser) {
        this(text, isUser, isUser ? "" : "Flash Lite");
    }

    public ChatMessage(String text, boolean isUser, String badge) {
        this.text = text;
        this.isUser = isUser;
        this.timestamp = System.currentTimeMillis();
        this.badge = badge;
    }

    public String getText() {
        return text;
    }

    public boolean isUser() {
        return isUser;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getBadge() {
        return badge;
    }
}
