'use client';

// import React from "react";
import React, { useEffect, useState, useReducer } from "react";


type Bit = string;


type BitOperation = 
  | {type: "AND", parameter: Bit}
  | {type: "OR", parameter: Bit}
  | {type: "XOR", parameter: Bit}
  | {type: "NOT"}
  | {type: "CYCLIC LEFT SHIFT"}
  | {type: "CYCLIC RIGHT SHIFT"}

  
type Status =
  | "ProblemSelectionScreen"
  | "GameScreen"


function bitReducer(state: Bit, action: BitOperation): Bit {
  switch (action.type) {
    case "AND": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" && action.parameter[index] === "1") ? "1" : "0";
      }).join("");
      return newState;
    }
    case "OR": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" || action.parameter[index] === "1") ? "1" : "0";
      }).join("");
      return newState;
    }
    case "XOR": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" && action.parameter[index] === "0") || (bit === "0" && action.parameter[index] === "1") ? "1" : "0";
      }
      ).join("");
      return newState;
    }
    case "NOT": {
      const newState = state.split("").map((bit) => {
        return (bit === "1") ? "0" : "1";
      }).join("");
      return newState;
    }
    case "CYCLIC LEFT SHIFT": {
      const newState = state.slice(1) + state[0];
      return newState;
    }
    case "CYCLIC RIGHT SHIFT": {
      const newState = state[state.length - 1] + state.slice(0, -1);
      return newState;
    }
    default:
      throw new Error("Unknown operation");
  }
}

function BitOperationButton({ dispatch, operation }: { dispatch: React.Dispatch<BitOperation>; operation: BitOperation }) {
  return (
    <button className="bitOperationButton" onClick={() => dispatch({ ...operation})}>
      {operation.type}
      {"parameter" in operation && ` ${operation.parameter}`}
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
    <div className="bitDisplay"> {currentBits} </div>
  )
}

function ProblemButtonContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="problemButtonContainer">
      {children}
    </div>
  );
}

function ProblemButton({ problem, setStatus }: { problem: string, setStatus: React.Dispatch<React.SetStateAction<Status>> }) {
  return (
    <button className="problemButton" onClick={() => setStatus("GameScreen")}>
      {problem}
    </button>
  );
}

function ProblemSelection({ setStatus }: { setStatus: React.Dispatch<React.SetStateAction<Status>>}) {
  return (
    <div>
      <ProblemButtonContainer>
        <ProblemButton problem="Problem 1" setStatus={setStatus} />
        <ProblemButton problem="Problem 2" setStatus={setStatus} />
      </ProblemButtonContainer>
    </div>
  );
}

function ReturnToProblemSelectionButton({ setStatus } : { setStatus : React.Dispatch<React.SetStateAction<Status>>}){
  return (
    <button className="returnToProblemSelectionButton" onClick={() => setStatus("ProblemSelectionScreen")}>
      戻る
    </button>
  )
}

function Game({ setStatus }: { setStatus: React.Dispatch<React.SetStateAction<Status>>}) {
  const [bit, dispatch] = useReducer(bitReducer, "-----");
  const [operations, setOperations] = useState<BitOperation[]>([]);

  // useEffect(() => {
  //   const newOperations: BitOperation[] = [
  //     { type: "AND", parameter: "11101"},
  //     { type: "OR", parameter:"10101" },
  //     { type: "XOR", parameter: "10001" },
  //     { type: "NOT" },
  //     { type: "CYCLIC LEFT SHIFT" },
  //   ];
  //   setOperations(newOperations);
  // }, []); // 空の依存配列で初回レンダリング時のみ実行

  useEffect(() => {
    async function fetchOperations() {
      const response = await fetch("/problems/problem1.json");
      const data = await response.json();
      setOperations(data.operations);
    }
    fetchOperations();
  }, []); 
  

  return (
    <div>
      <BitDisplay currentBits={bit} />
      <BitOperationButtonContainer>
        {operations.map((operation, index) => (
          <BitOperationButton key={index} dispatch={dispatch} operation={operation} />
        ))}
      </BitOperationButtonContainer>
      <ReturnToProblemSelectionButton setStatus={setStatus} />
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState<Status>("ProblemSelectionScreen");
  switch (status){
    case "ProblemSelectionScreen":
      return (
        <div>
          <h1 className="title">Bit Breaker</h1>
          <ProblemSelection setStatus={setStatus} />
        </div>
      );
    case "GameScreen":
      return (
        <div>
          <h1 className="title">Bit Breaker</h1>
          <Game setStatus={setStatus}/>
        </div>
      );
  }
}
