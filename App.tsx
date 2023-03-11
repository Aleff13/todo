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
  ListItem,
} from "@react-native-material/core";

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
        ></ListItem>
      ))}
    </View>
  );
};

const App = () => {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [visible, setVisible] = useState(false);

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
                <Stack spacing={2}>
                  <Text>
                    Digite a descrição/titulo e a data de expiração
                  </Text>
                  <TextInput
                    label="O que você quer lembrar?"
                    variant="standard"
                    onChangeText={(text) => setText(text)}
                    style={styles.input}
                    value={text}
                  />
                </Stack>
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
                    add(text);
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
