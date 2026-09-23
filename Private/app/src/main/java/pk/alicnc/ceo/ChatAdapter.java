package pk.alicnc.ceo;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.List;

public class ChatAdapter extends BaseAdapter {
    private final Context context;
    private final List<ChatMessage> messages;
    private final LayoutInflater inflater;

    public ChatAdapter(Context context, List<ChatMessage> messages) {
        this.context = context;
        this.messages = messages;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return messages.size();
    }

    @Override
    public Object getItem(int position) {
        return messages.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.item_chat_message, parent, false);
            holder = new ViewHolder();
            holder.userContainer = convertView.findViewById(R.id.layout_user_container);
            holder.assistantContainer = convertView.findViewById(R.id.layout_assistant_container);
            holder.userText = convertView.findViewById(R.id.tv_user_text);
            holder.assistantText = convertView.findViewById(R.id.tv_assistant_text);
            holder.assistantBadge = convertView.findViewById(R.id.tv_assistant_badge);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        ChatMessage message = messages.get(position);
        if (message.isUser()) {
            holder.userContainer.setVisibility(View.VISIBLE);
            holder.assistantContainer.setVisibility(View.GONE);
            holder.userText.setText(message.getText());
        } else {
            holder.userContainer.setVisibility(View.GONE);
            holder.assistantContainer.setVisibility(View.VISIBLE);
            holder.assistantText.setText(message.getText());
            holder.assistantBadge.setText(message.getBadge());
        }

        return convertView;
    }

    private static class ViewHolder {
        LinearLayout userContainer;
        LinearLayout assistantContainer;
        TextView userText;
        TextView assistantText;
        TextView assistantBadge;
    }
}
