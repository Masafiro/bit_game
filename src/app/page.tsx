'use client';

// import React from "react";
import React, { useEffect, useState, useReducer } from "react";

type Bit = string;
type BitHistory = Bit[];

type BitOperation =
  | {operation_type: "set", parameter: Bit}
  | {operation_type: "and", parameter: Bit}
  | {operation_type: "or", parameter: Bit}
  | {operation_type: "xor", parameter: Bit }
  | {operation_type: "xnor", parameter: Bit}
  | {operation_type: "not"}
  | {operation_type: "cyclic-lshift"}
  | {operation_type: "cyclic-rshift"}

type Problem = {bit_length: number, start: Bit, target: Bit, operation_count: number, operations: BitOperation[], minimum_moves: number}

type BitHistoryOperation =
  | {operation_type: "append", parameter: Bit}
  | {operation_type: "bitoperation", bit_operation: BitOperation}
  | {operation_type: "pop"}
  | {operation_type: "clear"}

type Status =
  | {status_type: "ProblemSelectionScreen"}
  | {status_type: "GameScreen", problem_file: string}

function OperateBit(state: Bit, action: BitOperation): Bit {
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
    case "xnor": {
      const newState = state.split("").map((bit, index) => {
        return (bit === action.parameter[index]) ? "1" : "0";
      }).join("");
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

function BitHistoryReducer(state: BitHistory, action: BitHistoryOperation): BitHistory {
  switch (action.operation_type) {
    case "append": {
      let newState = structuredClone(state);
      newState.push(action.parameter);
      return newState;
    }
    case "bitoperation": {
      let newState = structuredClone(state);
      let nextBit = OperateBit(newState[newState.length - 1], action.bit_operation)
      newState.push(nextBit);
      return newState;
    }
    case "pop": {
      let newState = structuredClone(state);
      newState.pop();
      return newState;
    }
    case "clear": {
      let newState: Bit[] = [];
      return newState;
    }
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

function BitOperationButton({ dispatchBitHistory, operation }: { dispatchBitHistory: React.Dispatch<BitHistoryOperation>, operation: BitOperation }) {
  return (
    <button className="bitOperationButton" onClick={() => {
      dispatchBitHistory({operation_type: "bitoperation", bit_operation: operation});
    }}>
      {operation.operation_type}
      {"parameter" in operation && ` ${operation.parameter}`}
    </button>
  );
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

function UndoButton({ bitHistory, dispatchBitHistory } : { bitHistory: BitHistory, dispatchBitHistory: React.Dispatch<BitHistoryOperation> }){
  if (bitHistory.length === 1){
    return (
      <button className="undoButtonDisabled">
        1 手戻る
      </button>
    );
  } else {
    return (
      <button className="undoButtonEnabled" onClick={() => dispatchBitHistory({operation_type: "pop"})}>
        1 手戻る
      </button>
    );
  }
}

function RetryButton({ bitHistory, dispatchBitHistory } : { bitHistory: BitHistory, dispatchBitHistory: React.Dispatch<BitHistoryOperation> }){
  return (
    <button className="retryButton" onClick={() => {
      let initialBit = bitHistory[0];
      dispatchBitHistory({operation_type: "clear"});
      dispatchBitHistory({operation_type: "append", parameter: initialBit});
    }}>
      リトライ
    </button>
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
    <button className="returnToProblemSelectionButton" onClick={() => setStatus({status_type: "ProblemSelectionScreen"})}>
      戻る
    </button>
  )
}

function MoveCounter({ moveCount } : { moveCount : number }){
  return (
    <div>
      手数: {moveCount}
    </div>
  );
}

function Timer({ bitHistory, problem }: { bitHistory: BitHistory, problem: Problem}){
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    console.log(problem);
      if (bitHistory[bitHistory.length - 1] === problem.target){
        return;
      }
    const timer = setTimeout(() => {
      setCount(count + 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [count]);
  return (
    <div>
      タイム: {count / 1000}秒
    </div>
  )
}
function Game({ setStatus, problemFile }: { setStatus: React.Dispatch<React.SetStateAction<Status>>, problemFile: string}) {
  const [BitHistory, dispatchBitHistory] = useReducer(BitHistoryReducer, []);
  const [problem, setProblem] = useState<Problem>({bit_length: 0, start: "", target: "", operation_count: 0, operations: [], minimum_moves: 0});

  useEffect(() => {
    async function fetchOperations() {
      const response = await fetch("/problems/" + problemFile);
      const data = await response.json();
      setProblem(data.problem);
      dispatchBitHistory({"operation_type": "clear"});
      dispatchBitHistory({"operation_type": "append", "parameter": data.problem.start});
    }
    fetchOperations();
  }, []);

  console.log(problem);

  return (
    <div>
      <div>
        Target: {problem.target}
      </div>
      <BitDisplay currentBits={BitHistory[BitHistory.length - 1]} />
      <MoveCounter moveCount={BitHistory.length - 1} />
      <Timer bitHistory={BitHistory} problem={problem} />
      <BitOperationButtonContainer>
        {problem.operations.map((operation, index) => (
          <BitOperationButton key={index} dispatchBitHistory={dispatchBitHistory} operation={operation} />
        ))}
      </BitOperationButtonContainer>
      <UndoButton bitHistory={BitHistory} dispatchBitHistory={dispatchBitHistory} />
      <RetryButton bitHistory={BitHistory} dispatchBitHistory={dispatchBitHistory} />
      <div>
        <ReturnToProblemSelectionButton setStatus={setStatus} />
      </div>
      <div>
        BitHistory: {BitHistory.toString()}
      </div>
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
          <ProblemSelection setStatus={setStatus} />
          <DebugInfo status={status} />
        </div>
      );
    case "GameScreen":
      return (
        <div>
          <Title />
          <Game setStatus={setStatus} problemFile={status.problem_file}/>
          <DebugInfo status={status} />
        </div>
      );
  }
}
