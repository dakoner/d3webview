package com.google.apps.android.d3webview;

import android.content.Context;
import android.content.res.AssetManager;
import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.entity.StringEntity;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.protocol.HttpRequestHandler;

import java.io.ByteArrayOutputStream;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;


public class FileHandler implements HttpRequestHandler {
    private Context mContext = null;

    public FileHandler(Context context) {
        super();
        this.mContext = context;
    }

    public void handle(
            final HttpRequest request,
            final HttpResponse response,
            final HttpContext context) throws HttpException, IOException {
        String uri = "static_html/" + request.getRequestLine().getUri().substring(1,request.getRequestLine().getUri().length());

        AssetManager assetManager = mContext.getResources().getAssets();
        InputStream inputStream = null;

        try {
            inputStream = assetManager.open(uri);
            if (inputStream != null) {
                response.setStatusCode(HttpStatus.SC_OK);
                final byte[] buffer = new byte[0x10000];
                int count = 0;
                ByteArrayOutputStream os = new ByteArrayOutputStream();

                while ((count = inputStream.read(buffer)) >= 0) {
                    os.write(buffer, 0, count);
                }

                StringEntity se = new StringEntity(os.toString(), HTTP.UTF_8);
                se.setContentType("text/html");
                response.setEntity(se);
                inputStream.close();
                os.close();
            } else {
                response.setStatusCode(HttpStatus.SC_NOT_FOUND);
            }
        }
        catch (FileNotFoundException e){
                response.setStatusCode(HttpStatus.SC_NOT_FOUND);

        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }
}