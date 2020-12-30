import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DataDisplayMain(props) {
  return (
    <View style={{ padding: 5 }}>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Confirmed Cases: {props.confirmed}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Confirmed Cases Percentage:{" "}
        {((props.confirmed / props.population) * 100).toFixed(2)}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Recovered: {props.recovered}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Recovered Percentage:{" "}
        {((props.recovered / props.confirmed) * 100).toFixed(2)}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Deaths: {props.deaths}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Deaths Percentage: {((props.deaths / props.confirmed) * 100).toFixed(2)}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Critical Cases: {props.critical}
      </Text>
      <Text style={{ borderBottomWidth: 1, fontSize: 16 }}>
        Critical Cases Percentage:{" "}
        {((props.critical / props.confirmed) * 100).toFixed(2)}
      </Text>
    </View>
  );
}

function Main() {
  const [getdataSource, setdataSource] = useState(null);
  const [getdataPop, setdataPop] = useState(null);
  useEffect(() => {
    getDataCovid();
  }, []);
  useEffect(() => {
    getDataPop();
  }, []);
  const getDataCovid = async () => {
    return await fetch("https://covid-19-data.p.rapidapi.com/totals", {
      method: "GET",
      headers: {
        "x-rapidapi-key": "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getDataPop = async () => {
    return await fetch(
      "https://world-population.p.rapidapi.com/worldpopulation",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "world-population.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataPop(responseJson);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>World Covid Update</Text>
      {getdataSource !== null && getdataPop !== null ? (
        <View style={{ borderWidth: 2 }}>
          <DataDisplayMain
            critical={getdataSource[0].critical}
            deaths={getdataSource[0].deaths}
            confirmed={getdataSource[0].confirmed}
            recovered={getdataSource[0].recovered}
            population={getdataPop.body.world_population}
          />
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}

function CountryDetails({ route }) {
  const cont = route.params.cont;
  const [getdataSource, setdataSource] = useState(null);
  const [getdataPop, setdataPop] = useState(null);
  const [getCountry, setCountry] = useState(cont);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getDataPop();
  }, []);
  const getDataPop = async () => {
    return await fetch(
      "https://world-population.p.rapidapi.com/population?country_name=" +
        getCountry,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "world-population.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataPop(responseJson);
        console.log(getdataPop);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getData = async () => {
    return await fetch(
      "https://covid-19-data.p.rapidapi.com/country?name=" + getCountry,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson);
        console.log(getdataSource);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      {getdataSource !== null && getdataPop !== null ? (
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontSize: 36, alignSelf: "center" }}>
            {getCountry} Covid Update
          </Text>
          <View style={{ borderWidth: 2 }}>
            <DataDisplayMain
              critical={getdataSource[0].critical}
              deaths={getdataSource[0].deaths}
              confirmed={getdataSource[0].confirmed}
              recovered={getdataSource[0].recovered}
              population={getdataPop.body.population}
            />
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}

function FavList({ navigation, route }) {
  var x = 1;
  const [getdataSource, setdataSource] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("Keys" + keys);
      var list = [];
      for (let i = 0; i < keys.length; i++) {
        var value = await AsyncStorage.getItem(keys[i]);
        const cont = JSON.parse(value).value;
        console.log(cont);
        if (value !== null) {
          list.push(cont);
        }
      }
      setdataSource(list);
      console.log(getdataSource);
    } catch (e) {
      console.error(e);
    }
  };

  const saveData = async (key) => {
    try {
      await AsyncStorage.removeItem("@storage_Key_" + key);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {getdataSource && (
        <FlatList
          data={getdataSource}
          keyExtractor={() => String(x++)}
          renderItem={({ item }) => (
            <View style={styles.listStyle}>
              <TouchableOpacity
                key={Math.random()}
                onPress={() => navigation.navigate("Detail", { cont: item })}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Text>{item}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ width: "40%" }}
                    onPress={() => saveData(item)}
                  >
                    <Ionicons name="md-heart" size="32" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

function CountryList({ navigation, route }) {
  var x = 1;
  const [getdataSource, setdataSource] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    return await fetch(
      "https://world-population.p.rapidapi.com/allcountriesname",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "world-population.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson.body.countries);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem(
        "@storage_Key_" + data,
        JSON.stringify({ value: data })
      );
    } catch (e) {
      // saving error
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {getdataSource && (
        <FlatList
          data={getdataSource}
          keyExtractor={() => String(x++)}
          renderItem={({ item }) => (
            <View style={styles.listStyle}>
              <TouchableOpacity
                key={Math.random()}
                onPress={() => navigation.navigate("Detail", { cont: item })}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "space-between",
                    width: "100%",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ width: "40%" }}
                    onPress={() => saveData(item)}
                  >
                    <Ionicons name="md-heart-empty" size="32" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused
                ? "ios-information-circle"
                : "ios-information-circle-outline";
            } else if (route.name === "Country List") {
              iconName = focused ? "ios-list-box" : "ios-list";
            } else if (route.name === "Marked Country") {
              iconName = focused ? "ios-list-box" : "ios-list";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={Main} />
        <Tab.Screen name="Country List" component={MyStack} />
        <Tab.Screen name="Marked Country" component={MyStackFav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function MyStack() {
  return (
    <Stack.Navigator initialRouteName={"CountryList"}>
      <Stack.Screen name="CountryList" component={CountryList} />
      <Stack.Screen name="Detail" component={CountryDetails} />
    </Stack.Navigator>
  );
}

function MyStackFav() {
  return (
    <Stack.Navigator initialRouteName={"CountryList"}>
      <Stack.Screen name="CountryList" component={FavList} />
      <Stack.Screen name="Detail" component={CountryDetails} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listStyle: {
    padding: 15,
    margin: 5,
    borderWidth: 2,
    borderRadius: 5,
  },
  textSyle: {
    fontSize: 18,
  },
});
