const handleReverseProxy = async (context) => {
    const originalUrl = context.request.url;
    const url = new URL(originalUrl);
    // /hub/内でなければ処理を中断
    if (url.pathname.indexOf("/hub") !== 0) {
      return await context.next();
    }
    // /hub/内であればhttps://takeno-io-hub.pages.devよりコンテンツを取得
    const newUrl = new URL(
      `https://takeno-io-hub.pages.dev${url.pathname.replace("/hub", "")}${url.search}`
    );
    const response = await fetch(new Request(newUrl), {
      headers: new Headers(context.request.headers),
    });
    // 取得したコンテンツをレスポンスとして返す
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  };
  
  export const onRequest = [handleReverseProxy];