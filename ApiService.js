import { AsyncStorage } from "react-native";
import I18n from "react-native-i18n";

export default class apiService {
  setProps(props) {
    this.props = props;
    return this;
  }

  headers_common = () => {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": this.props.user.lang
    };
  };

  headers_authorised = () => {
    return {
      Authorization: "Bearer "
    };
  };

  apiHost = () => {
    return "http://example/api/";
  };

  filters = async (method = "get", body = {}, doneFunc = false, successFunc = false, errorFunc = false) => {
    let uri = this.apiHost() + "filters";

    return this.request(uri, method, body, doneFunc, successFunc, errorFunc);
  };

  hotelNews = async (method = "get", body = {}, filters = {}, doneFunc = false, successFunc = false, errorFunc = false) => {
    let uri = this.apiHost() + "news?withHotel=true&withCity=true" + "&hotel=" + filters.hotelId;

    return this.request(uri, method, body, doneFunc, successFunc, errorFunc);
  };

  corporateNews = async (method = "get", body = {}, doneFunc = false, successFunc = false, errorFunc = false) => {
    let uri = this.apiHost() + "news?is_corporate=true";

    return this.request(uri, method, body, doneFunc, successFunc, errorFunc);
  };

  request = async (uri, method = "get", body = {}, doneFunc = false, successFunc = false, errorFunc = false) => {
    let token = await AsyncStorage.getItem("user_token");
    let localization = I18n.currentLocale().substr(0, 2);

    let headerObject = {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "Content-Language": localization
      }
    };

    if (method != "get" && body != false) {
      headerObject.body = JSON.stringify(body);
    }

    try {
      let response = await fetch(uri, headerObject);
      return this.responseParse(response, doneFunc, successFunc, errorFunc);
    } catch (error) {
      if (isFunction(doneFunc)) doneFunc();
      if (isFunction(errorFunc)) errorFunc(error);

      return error;
    }
  };

  responseParse = async (response, doneFunc, successFunc, errorFunc) => {
    try {
      switch (response.status) {
        case 200:
          let responseJson = await response.json();

          if (isFunction(doneFunc)) doneFunc();
          if (isFunction(successFunc)) successFunc(responseJson);

          return responseJson;

        case 302:
        case 401:
        case 404:
        case 409:
          let redirectJson = await response.json();

          if (isFunction(doneFunc)) doneFunc();
          if (isFunction(successFunc))
            successFunc({
              redirect: true,
              json: redirectJson,
              status: response.status
            });
          return {
            redirect: true,
            json: redirectJson,
            status: response.status
          };

        case 403:
          throw new Error("403 Forbidden");

        default:
          let errorMessages = [];
          let otherJson = await response.json();
          Object.keys(otherJson).forEach(function(key) {
            errorMessages.push(otherJson[key].join("\r\n"));
          });

          throw new Error(errorMessages.join("\r\n"));
      }
    } catch (error) {
      if (isFunction(doneFunc)) doneFunc();
      if (isFunction(errorFunc)) errorFunc(error);

      return error;
    }
  };
}

const isFunction = functionToCheck => {
  let getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === "[object Function]"
  );
};
