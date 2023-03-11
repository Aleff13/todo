import { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles/base.styles";
import ToDoRepository from "./services/service-db";
import { IItem } from "./models";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Provider,
  Stack,
  Button,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  TextInput,
  VStack,
  ListItem,
} from "@react-native-material/core";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

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
      {items.map(({ id, done, value, date }) => (
        <>
          <ListItem
            key={id}
            leading={<Icon name={done ? "check" : "note"} size={24} />}
            onPress={() => onPressItem && onPressItem(id)}
            title={value}
            secondaryText={new Date(date).toISOString().split("T")[0]}
            trailing={(props) => (
              <Icon
                name={
                  !done && new Date(date).getTime() - new Date().getTime() < 0
                    ? "clock-alert"
                    : "clock"
                }
                {...props}
              />
            )}
          ></ListItem>
        </>
      ))}
    </View>
  );
};

const App = () => {
  const [text, setText] = useState(null);
  const [date, setDate] = useState(new Date());
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    db.createTable();
  }, []);

  const add = (text: string, date: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    if (date === null || date === "") {
      return false;
    }

    let cleanDate = new Date(date).toISOString();

    db.insertItem(text, cleanDate, forceUpdate);
  };

  return (
    <Provider>
      <View style={{ top: 90 }}>
        <Text style={styles.heading}>TODO App</Text>
        <>
          <View style={styles.flexRow}>
            <Button
              title="Adicionar lembrete"
              style={{ margin: 16 }}
              onPress={() => setVisible(true)}
            />
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
              <DialogHeader title="Adicionar lembrete" />
              <DialogContent>
                <VStack m={8} spacing={20} divider={false}>
                  <Text>Digite a descrição/titulo e a data de expiração</Text>
                  <DateTimePicker
                    style={{ width: 90 }}
                    value={date}
                    onChange={(event: DateTimePickerEvent, date: Date) =>
                      setDate(date)
                    }
                  />
                  <TextInput
                    label="O que você quer lembrar?"
                    variant="filled"
                    onChangeText={(text) => setText(text)}
                    value={text}
                  />
                </VStack>
              </DialogContent>
              <DialogActions>
                <Button
                  title="Cancelar"
                  compact
                  variant="text"
                  onPress={() => setVisible(false)}
                />
                <Button
                  title="Salvar"
                  compact
                  variant="text"
                  onPress={() => {
                    // add(text);
                    add(text, date.toISOString());
                    setText(null);
                    setVisible(false);
                  }}
                />
              </DialogActions>
            </Dialog>
          </View>
          <ScrollView style={{ padding: 10 }}>
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
    </Provider>
  );
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
};

export default App;
