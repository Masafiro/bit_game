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

function BitOperationButton({ dispatch, operation }: { dispatch: React.Dispatch<BitOperation>; operation: BitOperation }) {
  return (
    <button className="bitOperationButton" onClick={() => dispatch({ ...operation})}>
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

function Game({ setStatus, problemFile }: { setStatus: React.Dispatch<React.SetStateAction<Status>>, problemFile: string}) {
  const [bit, dispatch] = useReducer(bitReducer, "-----");
  const [operations, setOperations] = useState<BitOperation[]>([]);

  useEffect(() => {
    async function fetchOperations() {
      const response = await fetch("/problems/" + problemFile);
      const data = await response.json();
      setOperations(data.problem.operations);
      dispatch({"operation_type": "set", "parameter": data.problem.start});
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
  const [status, setStatus] = useState<Status>({status_type: "ProblemSelectionScreen"});
  switch (status.status_type){
    case "ProblemSelectionScreen":
      return (
        <div>
          <h1 className="title">Bit Breaker</h1>
          <div>
            status_type: {status.status_type}
          </div>
          <ProblemSelection setStatus={setStatus} />
        </div>
      );
    case "GameScreen":
      return (
        <div>
          <h1 className="title">Bit Breaker</h1>
          <div>
            status_type: {status.status_type}
          </div>
          <div>
            problem_file: {status.problem_file}
          </div>
          <Game setStatus={setStatus} problemFile={status.problem_file}/>
        </div>
      );
  }
}
