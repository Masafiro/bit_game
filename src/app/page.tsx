'use client';

// import React from "react";
import React, { useEffect, useState, useReducer } from "react";

type Bit = string;

type BitOperation = 
  | {operation_type: "set", parameter: Bit}
  | {operation_type: "and", parameter: Bit}
  | {operation_type: "or", parameter: Bit}
  | {operation_type: "xor", parameter: Bit}
  | {operation_type: "not"}
  | {operation_type: "cyclic-lshift"}
  | {operation_type: "cyclic-rshift"}
  
type Status =
  | {status_type: "ProblemSelectionScreen"}
  | {status_type: "GameScreen", problem_file: string}

function bitReducer(state: Bit, action: BitOperation): Bit {
  switch (action.operation_type) {
    case "set": {
      return action.parameter;
    }
    case "and": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" && action.parameter[index] === "1") ? "1" : "0";
      }).join("");
      return newState;
    }
    case "or": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" || action.parameter[index] === "1") ? "1" : "0";
      }).join("");
      return newState;
    }
    case "xor": {
      const newState = state.split("").map((bit, index) => {
        return (bit === "1" && action.parameter[index] === "0") || (bit === "0" && action.parameter[index] === "1") ? "1" : "0";
      }
      ).join("");
      return newState;
    }
    case "not": {
      const newState = state.split("").map((bit) => {
        return (bit === "1") ? "0" : "1";
      }).join("");
      return newState;
    }
    case "cyclic-lshift": {
      const newState = state.slice(1) + state[0];
      return newState;
    }
    case "cyclic-rshift": {
      const newState = state[state.length - 1] + state.slice(0, -1);
      return newState;
    }
    default:
      throw new Error("Unknown operation");
  }
}

type MoveCountOperation = 
  | "Increment"
  | "Decrement"

function MoveCountReducer(state: number, action: MoveCountOperation): number {
  switch (action) {
    case "Increment": {
      const newState = state + 1;
      return newState;
    }
    case "Decrement": {
      const newState = state - 1;
      return newState;
    }
  }
}

function BitOperationButton({ dispatchBit, dispatchMoveCount, operation }: { dispatchBit: React.Dispatch<BitOperation>, dispatchMoveCount: React.Dispatch<MoveCountOperation>, operation: BitOperation }) {
  return (
    <button className="bitOperationButton" onClick={() => {
      dispatchBit({ ...operation});
      dispatchMoveCount("Increment");
    }}>
      {operation.operation_type}
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

function ProblemButton({ problem, problemFile, setStatus }: { problem: string, problemFile: string, setStatus: React.Dispatch<React.SetStateAction<Status>> }) {
  return (
    <button className="problemButton" onClick={() => setStatus({status_type: "GameScreen", problem_file: problemFile})}>
      {problem}
    </button>
  );
}

function ProblemSelection({ setStatus }: { setStatus: React.Dispatch<React.SetStateAction<Status>>}) {
  return (
    <div>
      <ProblemButtonContainer>
        <ProblemButton problem="Problem 1" problemFile="problem1.json" setStatus={setStatus} />
        <ProblemButton problem="Problem 2" problemFile="problem2.json" setStatus={setStatus} />
        <ProblemButton problem="Problem 3" problemFile="problem3.json" setStatus={setStatus} />
      </ProblemButtonContainer>
    </div>
  );
}

function ReturnToProblemSelectionButton({ setStatus } : { setStatus : React.Dispatch<React.SetStateAction<Status>>}){
  return (
    <div>
      <button className="returnToProblemSelectionButton" onClick={() => setStatus({status_type: "ProblemSelectionScreen"})}>
        戻る
      </button>
    </div>
  )
}

function MoveCounter({ moveCount } : { moveCount : number }){
  return (
    <div>
      手数: {moveCount}
    </div>
  );
}

function Game({ setStatus, problemFile }: { setStatus: React.Dispatch<React.SetStateAction<Status>>, problemFile: string}) {
  const [bit, dispatchBit] = useReducer(bitReducer, "-----");
  const [operations, setOperations] = useState<BitOperation[]>([]);
  const [moveCount, dispatchMoveCount] = useReducer(MoveCountReducer, 0);
  
  useEffect(() => {
    async function fetchOperations() {
      const response = await fetch("/problems/" + problemFile);
      const data = await response.json();
      setOperations(data.problem.operations);
      dispatchBit({"operation_type": "set", "parameter": data.problem.start});
    }
    fetchOperations();
  }, []); 

  return (
    <div>
      <BitDisplay currentBits={bit} />
      <MoveCounter moveCount={moveCount} />
      <BitOperationButtonContainer>
        {operations.map((operation, index) => (
          <BitOperationButton key={index} dispatchBit={dispatchBit} dispatchMoveCount={dispatchMoveCount} operation={operation} />
        ))}
      </BitOperationButtonContainer>
      <ReturnToProblemSelectionButton setStatus={setStatus} />
    </div>
  );
}

function Title(){
  return (
    <div>
      <h1 className="title">Bit Breaker</h1>
    </div>
  );
}

function DebugInfo({ status } : {status: Status }){
  switch (status.status_type){
    case "ProblemSelectionScreen":
      return (
        <div>
          status_type: {status.status_type}
        </div>
      );
    case "GameScreen":
      return (
        <div>
          status_type: {status.status_type}
          <br/>
          problem_file: {status.problem_file}
        </div>
      );
  }
}

export default function Home() {
  const [status, setStatus] = useState<Status>({status_type: "ProblemSelectionScreen"});
  switch (status.status_type){
    case "ProblemSelectionScreen":
      return (
        <div>
          <Title />
          <DebugInfo status={status} />
          <ProblemSelection setStatus={setStatus} />
        </div>
      );
    case "GameScreen":
      return (
        <div>
          <Title />
          <DebugInfo status={status} />
          <Game setStatus={setStatus} problemFile={status.problem_file}/>
        </div>
      );
  }
}
