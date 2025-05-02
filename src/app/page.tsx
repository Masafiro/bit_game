'use client';

// import React from "react";
import { useEffect, useState, useReducer } from "react";


interface Bit {
  value: string;
  length: number;
}


const initialState: Bit = {
  value: "00000",
  length: 5,
};


type BitOperation = 
  | {type: "AND", parameter: Bit}
  | {type: "OR", parameter: Bit}
  | {type: "XOR", parameter: Bit}
  | {type: "NOT"}
  | {type: "CYCLIC LEFT SHIFT"}
  | {type: "CYCLIC RIGHT SHIFT"}


function bitReducer(state: Bit, action: BitOperation): Bit {
  if ("parameter" in action) {
    if (action.parameter.length !== state.length) {
      throw new Error("Bit length mismatch");
    }
  }
  switch (action.type) {
    case "AND": {
      const newValue = state.value.split("").map((bit, index) => {
        return (bit === "1" && action.parameter.value[index] === "1") ? "1" : "0";
      }).join("");
      return { ...state, value: newValue };
    }
    case "OR": {
      const newValue = state.value.split("").map((bit, index) => {
        return (bit === "1" || action.parameter.value[index] === "1") ? "1" : "0";
      }).join("");
      return { ...state, value: newValue };
    }
    case "XOR": {
      const newValue = state.value.split("").map((bit, index) => {
        return (bit === "1" && action.parameter.value[index] === "0") || (bit === "0" && action.parameter.value[index] === "1") ? "1" : "0";
      }).join("");
      return { ...state, value: newValue };
    }
    case "NOT": {
      const newValue = state.value.split("").map((bit) => {
        return (bit === "1") ? "0" : "1";
      }).join("");
      return { ...state, value: newValue };
    }
    case "CYCLIC LEFT SHIFT": {
      const newValue = state.value.slice(1) + state.value[0];
      return { ...state, value: newValue };
    }
    case "CYCLIC RIGHT SHIFT": {
      const newValue = state.value[state.value.length - 1] + state.value.slice(0, -1);
      return { ...state, value: newValue };
    }
    default:
      throw new Error("Unknown Bit operation type");
  }
}


function BitOperationButton({ dispatch, operation }: { 
  dispatch: React.Dispatch<BitOperation>; 
  operation: BitOperation 
}) {
  return (
    <button className="bitOperationButton" onClick={() => dispatch({ ...operation})}>
      {operation.type}
      {"parameter" in operation && ` ${operation.parameter.value}`}
    </button>
  )
}

function BitOperationButtonContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bitOperationButtonContainer">
      {children}
    </div>
  );
}


function BitDisplay({ currentBits }: { currentBits: Bit }) {
  return (
    <div className="bitDisplay"> {currentBits.value} </div>
  )
}


function Game (){
  const [bit, dispatch] = useReducer(bitReducer, initialState);
  const [operations, setOperations] = useState<BitOperation[]>([]);

  // useEffect(() => {
  //   const newOperations: BitOperation[] = [
  //     { type: "AND", parameter: { value: "11101", length: 5 } },
  //     { type: "OR", parameter: { value: "10101", length: 5 } },
  //     { type: "XOR", parameter: { value: "10001", length: 5 } },
  //     { type: "NOT" },
  //     { type: "CYCLIC LEFT SHIFT" },
  //   ];
  //   setOperations(newOperations);
  // }, []); // 空の依存配列で初回レンダリング時のみ実行

  useEffect(() => {
    async function fetchOperations() {
      const response = await fetch("/problems/problem0.json");
      const data = await response.json();
      setOperations(data.operations);
    }
    fetchOperations();
  }, []); 
  

  return (
    <div>
      <h1 className="title">Bit Breaker</h1>
      <BitDisplay currentBits={bit} />
      <BitOperationButtonContainer>
        {operations.map((operation, index) => (
          <BitOperationButton key={index} dispatch={dispatch} operation={operation} />
        ))}
      </BitOperationButtonContainer>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Game />
    </div>
  );
}

