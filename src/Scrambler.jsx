import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import ScramblerDescrambler from "./SvgGenerator";

function App() {
  const [shiftRegister, setShiftRegister] = useState([
    1, 0, 1, 1, 0, 0, 1, 0, 1, 0,
  ]);
  const [inputString, setInputString] = useState("10110001");
  const [isShow, setIsShow] = useState(false);
  const [elements, setElements] = useState([]);
  const [schema, setSchema] = useState("0101000100");

  const indices = Array.from(schema)
    .map((value, index) => (value === "1" ? index : -1))
    .filter((index) => index !== -1);

  function doScrembler() {
    const newElements = [];
    let newShiftRegister = [...shiftRegister];
    let accumulatedResult = "";
    let accumulatedResultRight = "";
    newElements.push(
      <ScramblerDescrambler
        key={0}
        scheme={schema}
        registerStatus={[...shiftRegister]}
        inputtedText={inputString}
        firstScremble={null}
        SecondScremble={null}
        ResultScremble={null}
        index={0}
        Result={null}
      />
    );

    for (let i = 0; i < inputString.length; i++) {
      setIsShow(false);
      const inputBit = inputString[inputString.length - i - 1];
      const shiftResult = indices.reduce((acc, index) => {
        return acc ^ newShiftRegister[index];
      }, 0);
      const result = inputBit ^ shiftResult;
      accumulatedResult += String(result);

      const rightResult = result ^ shiftResult;
      accumulatedResultRight += String(rightResult);

      newShiftRegister = newShiftRegister.slice(0, newShiftRegister.length - 1);
      newShiftRegister = [shiftResult, ...newShiftRegister];
      console.log(inputBit, shiftResult);
      newElements.push(
        <ScramblerDescrambler
          key={i + 1}
          index={i + 1}
          scheme={schema}
          registerStatus={newShiftRegister}
          inputtedText={inputString}
          firstScremble={shiftResult}
          SecondScremble={shiftResult}
          ResultScremble={accumulatedResult.split("").reverse().join("")}
          Result={accumulatedResultRight.split("").reverse().join("")}
        />
      );
    }
    setElements(newElements);
    setIsShow(true);
  }

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5} textAlign="center">
          Адитивний склемблер
        </Heading>
        <Stack spacing={4}>
          <Box>
            <Text mb={1}>Схема</Text>
            <Input
              placeholder="Схема"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
            />
          </Box>
          <Box>
            <Text mb={1}>Початковий регістр зсуву</Text>
            <Input
              placeholder="Початковий регістр зсуву"
              value={Array.isArray(shiftRegister) ? shiftRegister.join("") : ""}
              onChange={(e) => setShiftRegister(e.target.value.split(""))}
            />
          </Box>
          <Box>
            <Text mb={1}>Стрічка у 2-йковій системи числення</Text>
            <Input
              placeholder="Стрічка у 2-йковій системи числення"
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
            />
          </Box>
          <Button onClick={() => doScrembler()} colorScheme="teal">
            Почати
          </Button>
        </Stack>
      </Box>
      {isShow && <Box p={5}>{elements}</Box>}
    </ChakraProvider>
  );
}

export default App;
