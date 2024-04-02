import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import axios from "axios";
const { height, width } = Dimensions.get("window");
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { serverEndPoint } from "../config";

function Table({ headers, data }) {
  const total = () => {
    let val = data.map((item,index) => {
      return parseInt(item.amount);
    });
    return val.reduce((a, b) => a + b, 0);
  };
  const deleteOrder = async (id) => {
    try {
      let deleteit = await axios.get(
        serverEndPoint + "user/delete_cart_odd_row?id=" + id
      );
      deleteit = await deleteit.data;
      console.log("deleted");
    } catch (error) {
      console.log(error, "+++++>in delete it part");
    }
  };

  let TotalAmount = total();
  return (
    <View
      style={{
        marginHorizontal: width * 0.1,
      }}
    >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingVertical: height * 0.02,
          }}
        >
          Order Summary
        </Text>
        <View
          style={{
            borderBottomColor: "lightgrey",
            borderBottomWidth: 2,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {headers.map((item,index) => {
            return (
              <View
              key={index}

                style={[
                  styles.row,
                  {
                    width: width * 0.2,
                    height: 40,
                    justifyContent: "flex-start",
                    color:'#FF9432'
                  },
                ]}
              >
                <Text style={styles.centeredText}>{item}</Text>
              </View>
            );
          })}
        </View>

        <View
          style={{
            borderBottomColor: "lightgrey",
            borderBottomWidth: 2,
          }}
        />
        <View>
          {data.map((element,index) => {
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <View
                  style={[
                    styles.row,
                    {
                      width: width * 0.2,
                      height: 40,
                      justifyContent: "flex-start",
                    },
                  ]}
                >
                  <Text style={styles.centeredText}>
                    {element.date}-{element.month}-{element.year}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      width: width * 0.2,
                      height: 40,
                      justifyContent: "flex-start",
                    },
                  ]}
                >
                  <Text style={styles.centeredText}>
                    {(element.hour == 12)?12:element.hour % 12}{" "}
                    {parseInt(element.hour) < 12 ? "AM" : "PM"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      width: width * 0.2,
                      height: 40,
                      justifyContent: "flex-start",
                    },
                  ]}
                >
                  <Text style={styles.centeredText}>{element.amount}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteOrder(element.id)}
                  style={[
                    styles.row,
                    {
                      width: width * 0.2,
                      height: 40,
                      justifyContent: "flex-start",
                    },
                  ]}
                >
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "right",
            paddingVertical: height * 0.02,
          }}
        >
          Total - {TotalAmount}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: { fontSize: 15, fontWeight: "bold" },
});

export default Table;
