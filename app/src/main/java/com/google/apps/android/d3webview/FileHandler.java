package com.google.apps.android.d3webview;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;

import org.apache.http.HttpEntity;

import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.MethodNotSupportedException;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicHttpResponse;
import org.apache.http.protocol.HttpContext;
import org.apache.http.protocol.HttpRequestHandler;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.Locale;

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
        Log.i("FileHandler", "handle request");
        String uri = "static_html/" + request.getRequestLine().getUri().substring(1,request.getRequestLine().getUri().length());

        System.out.println("looking for: "+ uri);

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

                StringEntity se = new StringEntity(os.toString());
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