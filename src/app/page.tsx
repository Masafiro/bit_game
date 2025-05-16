'use client';

import React, { useEffect, useState, useReducer } from "react";
import './globals.css';
import { time } from "console";
import next from "next";

type Bit = string;
type bitHistory = Bit[];

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

type bitHistoryOperation =
  | {operation_type: "append", parameter: Bit}
  | {operation_type: "bitoperation", bit_operation: BitOperation}
  | {operation_type: "pop"}
  | {operation_type: "clear"}

type Status =
  | {status_type: "TitleScreen"}
  | {status_type: "ProblemSelectionScreen"}
  | {status_type: "TimeAttackSelectionScreen"}
  | {status_type: "ProblemModeGameScreen", problem_file: string}
  | {status_type: "TimeAttackModeGameScreen", time_attack_file: string}

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

function bitHistoryReducer(state: bitHistory, action: bitHistoryOperation): bitHistory {
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

function BitOperationButton({ dispatchbitHistory, operation }: { dispatchbitHistory: React.Dispatch<bitHistoryOperation>, operation: BitOperation }) {
  return (
    <button className="bitOperationButton" onClick={() => {
      dispatchbitHistory({operation_type: "bitoperation", bit_operation: operation});
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

function UndoButton({ bitHistory, dispatchbitHistory } : { bitHistory: bitHistory, dispatchbitHistory: React.Dispatch<bitHistoryOperation> }){
  if (bitHistory.length === 1){
    return (
      <button className="undoButtonDisabled">
        1 手戻る
      </button>
    );
  } else {
    return (
      <button className="undoButtonEnabled" onClick={() => dispatchbitHistory({operation_type: "pop"})}>
        1 手戻る
      </button>
    );
  }
}

function RetryButton({ bitHistory, dispatchbitHistory } : { bitHistory: bitHistory, dispatchbitHistory: React.Dispatch<bitHistoryOperation> }){
  return (
    <button className="retryButton" onClick={() => {
      let initialBit = bitHistory[0];
      dispatchbitHistory({operation_type: "clear"});
      dispatchbitHistory({operation_type: "append", parameter: initialBit});
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

function ProblemButton({ problemName, problemFile, setStatus }: { problemName: string, problemFile: string, setStatus: React.Dispatch<React.SetStateAction<Status>> }) {
  return (
    <button className="problemButton" onClick={() => setStatus({status_type: "ProblemModeGameScreen", problem_file: problemFile})}>
      {problemName}
    </button>
  );
}


function TimeAttackButtonContainer({children}: {children: React.ReactNode }) {
    return (
        <div className="timeAttackButtonContainer">
            {children}
        </div>
    )
}

function TimeAttackButton({timeAttackName, timeAttackFile, setStatus }: {timeAttackName: string, timeAttackFile: string, setStatus: React.Dispatch<React.SetStateAction<Status>> }) {
  return (
    <button className="timeAttackButton" onClick={() => setStatus({status_type: "TimeAttackModeGameScreen", time_attack_file: timeAttackFile})}>
      {timeAttackName} 
    </button>
  );
}

function ProblemModeButton({setStatus}: {setStatus: React.Dispatch<React.SetStateAction<Status>>;}){
    return (
        <button className="problemModeButton" onClick={() => setStatus({status_type: "ProblemSelectionScreen"})}>
          問題を解く
        </button>
    );
}
function TimeAttackModeButton({setStatus}: {setStatus: React.Dispatch<React.SetStateAction<Status>>;}){
    return (
        <button className="timeAttackModeButton" onClick={() => setStatus({status_type: "TimeAttackSelectionScreen"})}>
          タイムアタックをする
        </button>
    );
}
function ModeSelection({setStatus}: {setStatus: React.Dispatch<React.SetStateAction<Status>>; })
{
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "left",
                gap: "50px",
            }}
        >
            <ProblemModeButton setStatus={setStatus}/>
            <TimeAttackModeButton setStatus={setStatus}/>
        </div>
    );
}

function ProblemSelection({ setStatus }: { setStatus: React.Dispatch<React.SetStateAction<Status>>}) {
  return (
    <div>
      <ProblemButtonContainer>
        <ProblemButton problemName="Problem 1" problemFile="problem1.json" setStatus={setStatus} />
        <ProblemButton problemName="Problem 2" problemFile="problem2.json" setStatus={setStatus} />
        <ProblemButton problemName="Problem 3" problemFile="problem3.json" setStatus={setStatus} />
        <ProblemButton problemName="Problem 4" problemFile="problem3.json" setStatus={setStatus} />
        <ProblemButton problemName="Problem 5" problemFile="problem3.json" setStatus={setStatus} />
      </ProblemButtonContainer>
      <ReturnToTitleButton  setStatus={setStatus} />
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

function ReturnToTimeAttackSelectionButton({ setStatus } : { setStatus : React.Dispatch<React.SetStateAction<Status>>}){
    return (
      <button className="returnToTimeAttackSelectionButton" onClick={() => setStatus({status_type: "TimeAttackSelectionScreen"})}>
        戻る
      </button>
    )
  }
  

function ReturnToTitleButton({ setStatus } : { setStatus : React.Dispatch<React.SetStateAction<Status>>}){
    return (
      <button className="returnToTitleButton" onClick={() => setStatus({status_type: "TitleScreen"})}>
        戻る
      </button>     
    )
}

// タイムアタックにおける選択画面
function TimeAttackSelection({ setStatus }: { setStatus: React.Dispatch<React.SetStateAction<Status>>}){
    return(
        <div>
           <TimeAttackButtonContainer>
           <TimeAttackButton timeAttackName="5桁 1手 10問" timeAttackFile="time_attack1.json" setStatus={setStatus} />
           <TimeAttackButton timeAttackName="5桁 2手 10問" timeAttackFile="time_attack1.json" setStatus={setStatus} />
           </TimeAttackButtonContainer>
           <ReturnToTitleButton setStatus={setStatus} />
        </div>
    );
}


function MoveCounter({ moveCount } : { moveCount : number }){
  return (
    <div>
      手数: {moveCount}
    </div>
  );
}

function Timer({ isActive }: { isActive : boolean }){
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    if (isActive){
      const timer = setTimeout(() => {
        setCount(count + 100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count]);
  return (
    <div>
      タイム: {count / 1000}秒
    </div>
  )
}
function ProblemModeGame({ setStatus, problemFileName }: { setStatus: React.Dispatch<React.SetStateAction<Status>>, problemFileName: string}) {
  const [bitHistory, dispatchbitHistory] = useReducer(bitHistoryReducer, []);
  const [problem, setProblem] = useState<Problem>({bit_length: 0, start: "", target: "", operation_count: 0, operations: [], minimum_moves: 0});

  useEffect(() => {
    async function fetchProblem() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        console.log(`basepath: ${basePath}`); 
        const response = await fetch(`${basePath}/problems/${problemFileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProblem(data.problem);
        dispatchbitHistory({ operation_type: "clear" });
        dispatchbitHistory({ operation_type: "append", parameter: data.problem.start });
      } catch (error) {
        console.error("Error fetching problem file:", error);
        if (error instanceof Error) {
          alert(`問題ファイルの読み込みに失敗しました: ${error.message}`);
        } else {
          alert("問題ファイルの読み込みに失敗しました: 不明なエラーが発生しました。");
        }
      }
    }
    fetchProblem();
  }, []);

  return (
    <div>
      <div>
        Target: {problem.target}
      </div>
      <BitDisplay currentBits={bitHistory[bitHistory.length - 1]} />
      <MoveCounter moveCount={bitHistory.length - 1} />
      <Timer isActive={bitHistory[bitHistory.length - 1] !== problem.target} />
      <BitOperationButtonContainer>
        {problem.operations.map((operation, index) => (
          <BitOperationButton key={index} dispatchbitHistory={dispatchbitHistory} operation={operation} />
        ))}
      </BitOperationButtonContainer>
      <UndoButton bitHistory={bitHistory} dispatchbitHistory={dispatchbitHistory} />
      <RetryButton bitHistory={bitHistory} dispatchbitHistory={dispatchbitHistory} />
      <div>
        <ReturnToProblemSelectionButton setStatus={setStatus} />
      </div>
      <div>
        bitHistory: {bitHistory.toString()}
      </div>
    </div>
  );
}

type TimeAttack = {problems: string[], problem_count: number}

function TimeAttackModeGame({ setStatus, timeAttackFileName }: { setStatus: React.Dispatch<React.SetStateAction<Status>>, timeAttackFileName: string}) {
  const [timeAttack, setTimeAttack] = useState<TimeAttack>({problems: [], problem_count: 0});
  const [solvedProblemCount, setSolvedProblemCount] = useState<number>(0);
  const [currentProblem, setcurrentProblem] = useState<number>(0);
  const [problem, setProblem] = useState<Problem>({bit_length: 0, start: "", target: "", operation_count: 0, operations: [], minimum_moves: 0});
  const [bitHistory, dispatchbitHistory] = useReducer(bitHistoryReducer, []);

  useEffect(() => {
    async function fetchTimeAttack() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        console.log(`basepath: ${basePath}`); 
        const response = await fetch(`${basePath}/time_attack_data/${timeAttackFileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setTimeAttack(data);
        setcurrentProblem(1);
      } catch (error) {
        console.error("Error fetching problem file:", error);
        if (error instanceof Error) {
          alert(`問題ファイルの読み込みに失敗しました: ${error.message}`);
        } else {
          alert("問題ファイルの読み込みに失敗しました: 不明なエラーが発生しました。");
        }
      }
    }
    fetchTimeAttack();
  }, []);
  
  useEffect(() => {
    if (currentProblem === 0){
      return;
    }
    async function fetchProblem() {
      const problemIndex = Math.floor(Math.random() * timeAttack.problems.length);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const response = await fetch(`${basePath}/problems/${timeAttack.problems[problemIndex]}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProblem(data.problem);
        dispatchbitHistory({ operation_type: "clear" });
        dispatchbitHistory({ operation_type: "append", parameter: data.problem.start });
      } catch (error) {
        console.error("Error fetching problem file:", error);
        if (error instanceof Error) {
          alert(`問題ファイルの読み込みに失敗しました: ${error.message}`);
        } else {
          alert("問題ファイルの読み込みに失敗しました: 不明なエラーが発生しました。");
        }
      }
    };
    fetchProblem();
  }, [currentProblem]);

  useEffect(() => {
    if (bitHistory.length > 0 && bitHistory[bitHistory.length - 1] === problem.target){
      const nextSolvedProblemCount = solvedProblemCount + 1;
      setSolvedProblemCount(nextSolvedProblemCount);
      if (nextSolvedProblemCount < timeAttack.problem_count){
        setTimeout(() => {
          setcurrentProblem(nextSolvedProblemCount + 1);
        }, 1000);
      }
    }
  }, [bitHistory]);

  return (
    <div>
      解いた問題数: {solvedProblemCount}
      <br/>
      問題数: {timeAttack.problem_count}
      <br/>
      <div>
        Target: {problem.target}
      </div>
      <BitDisplay currentBits={bitHistory[bitHistory.length - 1]} />
      <MoveCounter moveCount={bitHistory.length - 1} />
      <Timer isActive={timeAttack.problem_count == 0 || solvedProblemCount < timeAttack.problem_count} />
      <BitOperationButtonContainer>
        {problem.operations.map((operation, index) => (
          <BitOperationButton key={index} dispatchbitHistory={dispatchbitHistory} operation={operation} />
        ))}
      </BitOperationButtonContainer>
      <UndoButton bitHistory={bitHistory} dispatchbitHistory={dispatchbitHistory} />
      <RetryButton bitHistory={bitHistory} dispatchbitHistory={dispatchbitHistory} />
      <div>
        <ReturnToTimeAttackSelectionButton setStatus={setStatus} />
      </div>
      <div>
        bitHistory: {bitHistory.toString()}
      </div> 
    </div>
  )
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
    case "ProblemModeGameScreen":
      return (
        <div>
          status_type: {status.status_type}
          <br/>
          problem_file: {status.problem_file}
        </div>
      );
    case "TimeAttackModeGameScreen":
      return (
        <div>
          status_type: {status.status_type}
          <br/>
          time_attack_file: {status.time_attack_file}
        </div>
      );
  }
}

export default function Home() {
  const [status, setStatus] = useState<Status>({status_type: "TitleScreen"});
  switch (status.status_type){
    case "TitleScreen":
        return(
          <div>
            <Title />
            <ModeSelection setStatus={setStatus} />
          </div>
        );
    case "ProblemSelectionScreen":
      return (
        <div>
          <Title />
          <ProblemSelection setStatus={setStatus} />
          <DebugInfo status={status} />
        </div>
      );
    case "TimeAttackSelectionScreen":
      return (
        <div>
          <Title />
          <TimeAttackSelection setStatus={setStatus} />
          <DebugInfo status={status} />
        </div>
      );
    case "ProblemModeGameScreen":
      return (
        <div>
          <Title />
          <ProblemModeGame setStatus={setStatus} problemFileName={status.problem_file}/>
          <DebugInfo status={status} />
        </div>
      );
    case "TimeAttackModeGameScreen":
      return (
        <div>
          <Title />
          <TimeAttackModeGame setStatus={setStatus} timeAttackFileName={status.time_attack_file}/>
          <DebugInfo status={status} />
        </div>
      );
  }
}