import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles/base.styles";
import ToDoRepository from "./services/service-db";
import { IItem } from "./models";
import {ListItem, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";


const db = new ToDoRepository();
db.openDatabase();

const Items = ({ done: doneHeading, onPressItem }) => {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    db.selectItems(doneHeading, setItems);
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <ListItem
          key={id}
          leading={<Icon name={done ? "check" : "note"} size={24} />}
          onPress={() => onPressItem && onPressItem(id)}
          title={value}
        >
        </ListItem>
      ))}
    </View>
  );
};

const App = () => {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.createTbale();
  }, []);

  const add = (text: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.insertItem(text, forceUpdate);
  };

  return (
    <View style={{top: 90}}>
      <Text style={styles.heading}>TODO App</Text>
      <>
        <View style={styles.flexRow}>
        <TextInput label="O que você quer lembrar?" variant="standard"
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => {
              add(text);
              setText(null);
            }}
            style={styles.input}
            value={text}
          />
        </View>
        <ScrollView style={{padding: 10}}>
          <Items
            key={`forceupdate-todo-${forceUpdateId}`}
            done={false}
            onPressItem={(id) => db.updateById(id, forceUpdate)}
          />
          <Items
            done
            key={`forceupdate-done-${forceUpdateId}`}
            onPressItem={(id) => db.deleteById(id, forceUpdate)}
          />
        </ScrollView>
      </>
    </View>
  );
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
};

export default App;
