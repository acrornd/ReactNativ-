import React, { Component } from "react";

import {
    Button,
    Text,
    View,
    TouchableHighlight,
    Image,
    ListView,
    ActivityIndicator,
    TextInput,
    RefreshControl,
    AsyncStorage,
    Alert,
    Dimensions,
    StyleSheet,
    ScrollView,
} from "react-native";

import { Actions } from "react-native-router-flux";
import I18n from '../../services/translate';
import styles from '../../styles/Styles';
import Header from '../Header';
import HotelNewsItem from '../HotelNewsItem';
import CorporateNewsItem from '../CorporateNewsItem';
import DropDown from '../DropDown';
import FilterService from '../../services/FilterService';
import * as Filters from '../../schemas/Constants';

const window = Dimensions.get('window');

export default class NewsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hotels: null,
        };
    }
    
    componentWillMount() {
        this.props.newsActions.getHotelNews();
    }

    toggleFilters = async (filter)=>{

        await this.setState({
            [Object.keys(filter)[0]]: filter[Object.keys(filter)]
        });

        this.props.newsActions.getHotelNews({hotelId: this.state.hotels,})
    }

    getHotelNews() {
        const { newsData } = this.props;
        return (dataNews = newsData.hotelNewsData.map((item, key) => {
            return <HotelNewsItem key={key} {...this.props} item={item} />;
        }));
    }

    getCorporateNews() {
        const { newsData } = this.props;
        return (dataNews = newsData.corporateNewsData.map((item, key) => {
            return <CorporateNewsItem key={key} {...this.props} item={item} />;
        }));
    }

    render() {
        const {newsData, newsActions} = this.props;
        return (
            <View style={styles.container}>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={styles.header}>
                        <Header {...this.props} title={I18n.t("news")}/>
                    </View>

                    <View style={styles.newsBar}>
                        <TouchableHighlight underlayColor={'transparent'} style={{ backgroundColor: newsData.displayCorpNews
                                                                                                        ? '#BDBDBD'
                                                                                                        : 'white'}} 
                                            onPress={() => {newsActions.getHotelNews()} }>
                            <View style={{height: 50, width: window.width * 0.5, justifyContent: 'center', alignItems: 'center',}}>
                                <Text>{I18n.t("hotel_news")}</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor={'transparent'} style={{ backgroundColor: newsData.displayCorpNews
                                                                                                        ? 'white'
                                                                                                        : '#BDBDBD'}} 
                                            onPress={() => {newsActions.getCorporateNews()} }>
                            <View style={{height: 50, width: window.width * 0.5, justifyContent: 'center', alignItems: 'center',}}>
                                <Text>{I18n.t("corporate_news")}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    {!newsData.displayCorpNews &&
                    <View style={styles.corporateNews}>
                        <DropDown 
                            data={FilterService.get(Filters.HOTEL) || []} 
                            dataType={Filters.HOTEL} 
                            placeholder={I18n.t("choose_hotel")} 
                            width={window.width*0.9} 
                            callback={(filter)=>{ this.toggleFilters(filter)}}/>
                    </View>
                    }

                </View>

                {
                    this.props.newsData.isFetching &&
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator animating={true} size="large" style={{height: 50}}/>
                    </View>
                }

                <ScrollView
                    refreshControl={
                        <RefreshControl
                         refreshing={false}
                          onRefresh={()=>{
                              newsData.displayCorpNews
                                ? newsActions.getCorporateNews()
                                : newsActions.getHotelNews()}}
                        />}>
                    {!newsData.displayCorpNews &&
                    <View>
                        {newsData.hotelNewsData
                            ? this.getHotelNews()
                            : <View style={styles.news_not_found}>
                                  <Text>{I18n.t("news_not_found")}</Text>
                              </View>
                        }
                    </View>}

                    {newsData.displayCorpNews &&
                    <View>
                        <View style={{height: window.height * 0.03, backgroundColor: '#ffffff'}}></View>
                        {newsData.corporateNewsData
                            ? this.getCorporateNews()
                            : <View style={styles.news_not_found}>
                                 <Text>{I18n.t("news_not_found")}</Text>
                              </View>
                        }
                    </View>}
                </ScrollView>
            </View>
        );
    }

}