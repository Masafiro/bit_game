'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import React from "react";
var react_1 = require("react");
function bitReducer(state, action) {
    switch (action.type) {
        case "AND": {
            var newState = state.split("").map(function (bit, index) {
                return (bit === "1" && action.parameter[index] === "1") ? "1" : "0";
            }).join("");
            return newState;
        }
        case "OR": {
            var newState = state.split("").map(function (bit, index) {
                return (bit === "1" || action.parameter[index] === "1") ? "1" : "0";
            }).join("");
            return newState;
        }
        case "XOR": {
            var newState = state.split("").map(function (bit, index) {
                return (bit === "1" && action.parameter[index] === "0") || (bit === "0" && action.parameter[index] === "1") ? "1" : "0";
            }).join("");
            return newState;
        }
        case "NOT": {
            var newState = state.split("").map(function (bit) {
                return (bit === "1") ? "0" : "1";
            }).join("");
            return newState;
        }
        case "CYCLIC LEFT SHIFT": {
            var newState = state.slice(1) + state[0];
            return newState;
        }
        case "CYCLIC RIGHT SHIFT": {
            var newState = state[state.length - 1] + state.slice(0, -1);
            return newState;
        }
        default:
            throw new Error("Unknown operation");
    }
}
function BitOperationButton(_a) {
    var dispatch = _a.dispatch, operation = _a.operation;
    return (<button className="bitOperationButton" onClick={function () { return dispatch(__assign({}, operation)); }}>
      {operation.type}
      {"parameter" in operation && " ".concat(operation.parameter)}
    </button>);
}
function BitOperationButtonContainer(_a) {
    var children = _a.children;
    return (<div className="bitOperationButtonContainer">
      {children}
    </div>);
}
function BitDisplay(_a) {
    var currentBits = _a.currentBits;
    return (<div className="bitDisplay"> {currentBits} </div>);
}
function ProblemButtonContainer(_a) {
    var children = _a.children;
    return (<div className="problemButtonContainer">
      {children}
    </div>);
}
function ProblemButton(_a) {
    var problem = _a.problem;
    return (<button className="problemButton">
      {problem}
    </button>);
}
function ProblemSelection() {
    return (<div>
      <ProblemButtonContainer>
        <ProblemButton problem="Problem 1"/>
        <ProblemButton problem="Problem 2"/>
      </ProblemButtonContainer>
    </div>);
}
function Game() {
    var _a = (0, react_1.useReducer)(bitReducer, "-----"), bit = _a[0], dispatch = _a[1];
    var _b = (0, react_1.useState)([]), operations = _b[0], setOperations = _b[1];
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
    (0, react_1.useEffect)(function () {
        function fetchOperations() {
            return __awaiter(this, void 0, void 0, function () {
                var response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("/problems/problem1.json")];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            setOperations(data.operations);
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchOperations();
    }, []);
    return (<div>
      <BitDisplay currentBits={bit}/>
      <BitOperationButtonContainer>
        {operations.map(function (operation, index) { return (<BitOperationButton key={index} dispatch={dispatch} operation={operation}/>); })}
      </BitOperationButtonContainer>
    </div>);
}
function Home() {
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    console.log("ehsviewackiusjvhyv");
    return (<div>
      <h1 className="title">Bit Breaker</h1>
      <ProblemSelection />
      <Game />

      <ProblemSelection />
      <Game />
    </div>);
}
exports["default"] = Home;
