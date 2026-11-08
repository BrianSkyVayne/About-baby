package id.asistenbayi.app;

import android.app.Activity;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import java.util.Collections;
import java.util.List;

/**
 * "Traktir kopi": dukungan sukarela lewat Google Play Billing.
 * Produk sekali beli yang bisa diulang (consumable) dengan ID {@link #PRODUCT_ID}; tidak membuka fitur apa pun.
 * Hanya tersedia bila aplikasi dipasang dari Play Store dan produknya sudah dibuat di Play Console.
 */
final class TipController {
    static final String PRODUCT_ID = "traktir_kopi";

    interface Result { void done(boolean ok, String message); }

    private final Activity activity;
    private final BillingClient client;
    private ProductDetails product;
    private Result pending;

    TipController(Activity activity) {
        this.activity = activity;
        this.client = BillingClient.newBuilder(activity)
                .setListener(this::onPurchasesUpdated)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .enableAutoServiceReconnection()
                .build();
    }

    void connect() {
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                loadProduct();
                consumeLeftovers();
            }

            @Override public void onBillingServiceDisconnected() { }
        });
    }

    boolean isReady() { return product != null; }

    String price() {
        ProductDetails.OneTimePurchaseOfferDetails o = product == null ? null : product.getOneTimePurchaseOfferDetails();
        return o == null ? "" : o.getFormattedPrice();
    }

    private void loadProduct() {
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Collections.singletonList(QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(PRODUCT_ID)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()))
                .build();
        client.queryProductDetailsAsync(params, (result, details) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
            List<ProductDetails> list = details.getProductDetailsList();
            if (!list.isEmpty()) product = list.get(0);
        });
    }

    /** Pembelian yang sempat terputus sebelum diselesaikan. */
    private void consumeLeftovers() {
        client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
                (result, purchases) -> {
                    if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                    for (Purchase p : purchases) if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) consume(p, null);
                });
    }

    void launch(Result callback) {
        if (product == null) { callback.done(false, "Traktir belum tersedia di perangkat ini."); return; }
        pending = callback;
        BillingFlowParams flow = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(
                        BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(product).build()))
                .build();
        activity.runOnUiThread(() -> {
            BillingResult r = client.launchBillingFlow(activity, flow);
            if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) finish(false, "Pembayaran tidak bisa dibuka.");
        });
    }

    private void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        int code = result.getResponseCode();
        if (code == BillingClient.BillingResponseCode.USER_CANCELED) { finish(false, ""); return; }
        if (code != BillingClient.BillingResponseCode.OK || purchases == null) { finish(false, "Pembayaran belum berhasil."); return; }
        for (Purchase p : purchases) {
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) consume(p, pending);
            else if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) finish(false, "Pembayaran sedang diproses. Terima kasih!");
        }
    }

    private void consume(Purchase p, Result callback) {
        ConsumeParams params = ConsumeParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build();
        client.consumeAsync(params, (r, token) -> {
            if (callback != null) finish(r.getResponseCode() == BillingClient.BillingResponseCode.OK, "Terima kasih atas dukungannya!");
        });
    }

    private void finish(boolean ok, String message) {
        Result cb = pending;
        pending = null;
        if (cb != null) cb.done(ok, message);
    }

    void destroy() { client.endConnection(); }
}
