import {
  FETCHING_CORPORATE_NEWS,
  FETCHING_CORPORATE_NEWS_FAILURE,
  FETCHING_CORPORATE_NEWS_SUCCESS,
  FETCHING_NEWS,
  FETCHING_NEWS_SUCCESS,
  FETCHING_HOTELS_FAILURE
} from "../../constants";
import api from "../../services/ApiService";

const getData = (type) => {
  return {
    type: type
  };
};

const getDataSuccess = (type, data) => {
  return {
    type: type,
    payload: data
  };
};

const getDataFailure = (type) => {
  return {
    type: type
  };
};

export const getHotelNews = (filters = {}) => {
  let request = new api();
  
  return dispatch => {
    dispatch(getData(FETCHING_NEWS));
    request.hotelNews('get', {}, { hotelId: filters.hotelId || '' }, false, false, false).then(data => {
      dispatch(getDataSuccess(FETCHING_NEWS_SUCCESS, data));
    });
  };
};

export const getCorporateNews = () => {
  let request = new api();

  return dispatch => {
    dispatch(getData(FETCHING_CORPORATE_NEWS));
    request.corporateNews().then(data => {      
      dispatch(getDataSuccess(FETCHING_CORPORATE_NEWS_SUCCESS, data));
    });
  };
};