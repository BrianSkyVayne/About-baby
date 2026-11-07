package id.asistenbayi.app;

import android.content.Context;
import android.webkit.WebResourceResponse;

import java.io.IOException;
import java.io.InputStream;

/** Melayani file di folder assets/ untuk alamat https://appassets.androidplatform.net/assets/... */
final class AssetServer {
    private static final String PREFIX = "/assets/";
    private final Context context;

    AssetServer(Context context) { this.context = context; }

    WebResourceResponse serve(String path) {
        if (path == null || !path.startsWith(PREFIX) || path.contains("..")) return notFound();
        String name = path.substring(PREFIX.length());
        try {
            InputStream in = context.getAssets().open(name);
            return new WebResourceResponse(mimeOf(name), "utf-8", in);
        } catch (IOException e) {
            return notFound();
        }
    }

    static String mimeOf(String name) {
        if (name.endsWith(".html")) return "text/html";
        if (name.endsWith(".js")) return "text/javascript";
        if (name.endsWith(".css")) return "text/css";
        if (name.endsWith(".json")) return "application/json";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }

    private static WebResourceResponse notFound() {
        WebResourceResponse r = new WebResourceResponse("text/plain", "utf-8", null);
        r.setStatusCodeAndReasonPhrase(404, "Not Found");
        return r;
    }
}
