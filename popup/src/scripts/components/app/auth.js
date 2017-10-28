const tokenFetcher = (function() {
  const clientId = "11442b0924c8d6a98fb7";
  const clientSecret = "a1499b1a5780c8a21ed560b839741e803c4cc936";
  const redirectUri = chrome.identity.getRedirectURL("provider_cb");
  const redirectRe = new RegExp(redirectUri + "[#?](.*)");

  const access_token = null;

  return {
    getToken: function(interactive, callback) {
      // In case we already have an access_token cached, simply return it.
      if (access_token) {
        callback(null, access_token);
        return;
      }

      const options = {
        interactive: interactive,
        url:
          "https://github.com/login/oauth/authorize" +
          "?client_id=" +
          clientId +
          "&redirect_uri=" +
          encodeURIComponent(redirectUri)
      };
      chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        console.log(
          "launchWebAuthFlow completed",
          chrome.runtime.lastError,
          redirectUri
        );

        if (chrome.runtime.lastError) {
          callback(new Error(chrome.runtime.lastError));
          return;
        }

        // Upon success the response is appended to redirectUri, e.g.
        // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
        //     &refresh_token={value}
        // or:
        // https://{app_id}.chromiumapp.org/provider_cb#code={value}
        const matches = redirectUri.match(redirectRe);
        if (matches && matches.length > 1)
          handleProviderResponse(parseRedirectFragment(matches[1]));
        else callback(new Error("Invalid redirect URI"));
      });

      function parseRedirectFragment(fragment) {
        const pairs = fragment.split(/&/);
        const values = {};

        pairs.forEach(function(pair) {
          const nameval = pair.split(/=/);
          values[nameval[0]] = nameval[1];
        });

        return values;
      }

      function handleProviderResponse(values) {
        console.log("providerResponse", values);
        if (values.hasOwnProperty("access_token"))
          setAccessToken(values.access_token);
        else if (values.hasOwnProperty("code"))
          // If response does not have an access_token, it might have the code,
          // which can be used in exchange for token.
          exchangeCodeForToken(values.code);
        else callback(new Error("Neither access_token nor code avialable."));
      }

      function exchangeCodeForToken(code) {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          "https://github.com/login/oauth/access_token?" +
            "client_id=" +
            clientId +
            "&client_secret=" +
            clientSecret +
            "&redirect_uri=" +
            redirectUri +
            "&code=" +
            code
        );
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function() {
          // When exchanging code for token, the response comes as json, which
          // can be easily parsed to an object.
          if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            if (response.hasOwnProperty("access_token")) {
              setAccessToken(response.access_token);
            } else {
              callback(new Error("Cannot obtain access_token from code."));
            }
          } else {
            console.log("code exchange status:", this.status);
            callback(new Error("Code exchange failed"));
          }
        };
        xhr.send();
      }

      function setAccessToken(token) {
        let access_token = token;
        console.log("Setting access_token: ", access_token);
        callback(null, access_token);
      }
    },

    removeCachedToken: function(token_to_remove) {
      if (access_token == token_to_remove) {
        let access_token = null;
      }
    }
  };
})();

const xhrWithAuth = (method, url, interactive, callback, props) => {
  var retry = true;
  var access_token;

  console.log("xhrWithAuth", method, url, interactive);
  getToken();

  function getToken() {
    tokenFetcher.getToken(interactive, function(error, token) {
      console.log("token fetch", error, token);
      if (error) {
        callback(error);
        return;
      }

      access_token = token;
      requestStart();
    });
  }

  function requestStart() {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.onload = requestComplete;
    xhr.send();
  }

  function requestComplete() {
    console.log("requestComplete", this.status, this.response);
    if ((this.status < 200 || this.status >= 300) && retry) {
      retry = false;
      tokenFetcher.removeCachedToken(access_token);
      access_token = null;
      getToken();
    } else {
      callback(null, this.status, this.response, props);
    }
  }
};

const getUserInfo = (interactive, props) => {
  xhrWithAuth(
    "GET",
    "https://api.github.com/user",
    interactive,
    onUserInfoFetched,
    props
  );
};

const onUserInfoFetched = (error, status, response, props) => {
  if (!error && status == 200) {
    console.log("Got the following user info: " + response);
    var user_info = JSON.parse(response);
    props.dispatch({
      type: "FETCH_USER",
      payload: user_info
    });
    console.log(props);
    // populateUserInfo(user_info);
    // hideButton(signin_button);
    // showButton(revoke_button);
    // fetchUserRepos(user_info["repos_url"]);
  } else {
    console.log("infoFetch failed", error, status);
    showButton(signin_button);
  }
};

const getUserFeeds = (interactive, props) => {
  xhrWithAuth(
    "GET",
    "https://api.github.com/feeds",
    interactive,
    onUserFeedsFetched,
    props
  );
};

const onUserFeedsFetched = (error, status, response, props) => {
  if (!error && status == 200) {
    console.log("Got the following user feeds: " + response);
    // var user_info = JSON.parse(response);
    console.log(props);
    // populateUserInfo(user_info);
    // hideButton(signin_button);
    // showButton(revoke_button);
    // fetchUserRepos(user_info["repos_url"]);
  } else {
    console.log("infoFetch failed", error, status);
    showButton(signin_button);
  }
};

const populateUserInfo = user_info => {
  var elem = user_info_div;
  var nameElem = document.createElement("div");
  nameElem.innerHTML =
    "<b>Hello " +
    user_info.name +
    "</b><br>" +
    "Your github page is: " +
    user_info.html_url;
  elem.appendChild(nameElem);
};

const fetchUserRepos = repoUrl => {
  xhrWithAuth("GET", repoUrl, false, onUserReposFetched);
};

const onUserReposFetched = (error, status, response) => {
  var elem = document.querySelector("#user_repos");
  elem.value = "";
  if (!error && status == 200) {
    console.log("Got the following user repos:", response);
    var user_repos = JSON.parse(response);
    user_repos.forEach(function(repo) {
      if (repo.private) {
        elem.value += "[private repo]";
      } else {
        elem.value += repo.name;
      }
      elem.value += "\n";
    });
  } else {
    console.log("infoFetch failed", error, status);
  }
};

// Handlers for the buttons's onclick events.

const interactiveSignIn = () => {
  disableButton(signin_button);
  tokenFetcher.getToken(true, function(error, access_token) {
    if (error) {
      showButton(signin_button);
    } else {
      getUserInfo(true);
    }
  });
};

export { tokenFetcher, getUserInfo, getUserFeeds };
