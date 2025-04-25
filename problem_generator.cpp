/*
    - ランダムに問題を生成するコードです．

    - 入力
        - 問題数 (得られる問題の個数)
        - 桁数n 
        - スタートの値 (n桁の2進数で与える 指定しないなら-1)
        - 目標の値 (n桁の2進数で与える 指定しないなら-1)
            - スタートの値と目標の値を与える時，それらは異なる必要がある
        - 手数制限  (下限と上限を入力)
        - 操作の種類数制限 (下限と上限を入力)
        - 各操作 (kはn桁の2進数)
            - and k     : 今の値にkをandした値を返す 
            - or k      : 今の値にkをorした値を返す
            - xor k     : 今の値にkをxorした値を返す
            - not       : 今の値の各bitを反転した値を返す
            - lshift    : 今の値を左shiftして2^nで割った値を返す
            - cyclic_lshift : 今の値を巡回左shiftした値を返す
            - rshift    : 今の値を右shiftした値を返す
            - cyclic_rshift : 今の値を巡回右shiftした値を返す
            - add k : 今の値にkを足して2^nで割った値を返す

    - 出力
        - 問題と最短手数
        - 最短手数を与える操作列

    - 例
    [入力]
        2  // 得る問題数
        5  // 桁数
        11000 11100 // スタートの値と目標の値
        2 3 // 手数の下限と上限 (最短手数が2手以上3手以下であるような問題を作る)
        2 3 // 操作の種類数制限 (操作の種類数が2種類以上3種類以下であるような問題を作る)
        1 // 自分で指定する操作の種類数
        and 01100 // 指定する操作操作
        
    [出力] 
        <Problem 1>
        bit_length : 5
        start : 24
        target : 12
        operation_count : 3
        add 10001 // 操作1
        or 10010 // 操作2
        and 10110 // 操作3
        turn_min : 3 // 問題の最短手数
        operation 1 : 1
        operation 2 : 2 
        operation 3 : 1 // 最短手数を与える操作列(操作の番号は問題の操作の書かれている順番に対応)

        <Problem 2>
        bit_length : 5
        start : 24
        target : 12
        operation_count : 3
        add 10001
        or 10101
        and 11101
        turn_min : 3
        operation 1 : 2
        operation 2 : 1
        operation 3 : 3

    <備考>
        - 問題のJSONファイルを出力する出力方法に対応する予定です．
*/

#include <algorithm>
#include <cstdint>
#include <vector>
#include <queue>
#include <iostream>
#include <set>
#include <random>
#include <cassert>
#include <bitset>
using namespace std;


vector<int> solver(int n, int m, unsigned int start, unsigned int target,
    vector<pair<string,unsigned int>> &operation, set<int> &counted, int turn_limit){
    queue<pair<unsigned int, vector<int>>> que;
    vector<int> initial;
    que.push(make_pair(start, initial));
    vector<int> answer;
    while(que.size()){
        auto pr = que.front();
        que.pop();

        if(pr.first == target){
            answer = pr.second;
            break;
        }

        if(pr.second.size() >= turn_limit) break;
        counted.insert(pr.first);
        if(!counted.count(pr.first))continue;

        for(int i = 0; i < m; i++){
            int now = pr.first;
            if(operation[i].first == "and"){
                now &= operation[i].second;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
            
            if(operation[i].first == "or"){
                now |= operation[i].second;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
            
            if(operation[i].first == "xor"){
                now ^= operation[i].second;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
           
            if(operation[i].first == "not"){
                now = (1<<n) - 1 - now;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }

            if(operation[i].first == "lshift"){
                unsigned int dec = 0;
                if((now >> (n - 1)) & 1) dec = (1 << n);
                now *= 2;
                now -= dec;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }

            if(operation[i].first == "cyclic_lshift"){
                unsigned int dec = 0;
                if((now >> (n - 1)) & 1) dec = (1 << n) - 1;
                now *= 2;
                now -= dec;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
            
            if(operation[i].first == "rshift"){
                now = now >> 1;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
            
            if(operation[i].first == "cyclic_rshift"){
                unsigned int inc = 0;
                if(now & 1) inc = (1 << (n - 1)); 
                now = now >> 1;
                now += inc;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
                now = pr.first;
            }
            
            if(operation[i].first == "add"){
                now += operation[i].second;
                now %= (1 << n);
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                }
            }
            
        }
    }
    return answer;

}

static uint32_t xorshift32() {
    static uint32_t state = []{
        std::random_device rd;
        return static_cast<uint32_t>(rd());
    }();

    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return state;
}

int rand_range(int i, int j) { //i以上j以下から1つ
    uint32_t range = static_cast<uint32_t>(j - i + 1);
    uint32_t r = xorshift32();
    return i + (r % range);
}

vector<int> rand_mult(int t, int s) { //0,1,...,t-1からs個
    vector<int> a(t);
    iota(a.begin(), a.end(), 0);
    for (int i = 0; i < s; ++i) {
        int j = rand_range(i, t-1);
        swap(a[i], a[j]);
    }
    a.resize(s);
    return a;
}

struct dataset{
    public: 
        int dightnum;
        int start;
        int target;
        int operationnum;
        vector<pair<string, unsigned int>> operation;
        int turn_min;
        vector<int> optimal_operation;
};

// void output_like_JSON


int main(){
    // 入力
    int problemnum;
    int dightnum;
    unsigned int start_inp;
    unsigned int target_inp;
    int movenum_min;
    int movenum_max;
    int operationnum_min;
    int operationnum_max;
    int req_operationnum;
    vector<string> all_operation = {"and", "or", "xor", "add", "not", "lshift", "cyclic_lshift", "rshift", "cyclic_rshift"};
    vector<string> moreinf_operation = {"and", "or", "xor", "add"}; //追加情報が必要なoperation
    cin >> problemnum >> dightnum; 

    string start_str;
    cin >> start_str;
    if(start_str != "-1") 
    start_inp = stoul(start_str, nullptr, 2);
    string target_str;
    cin >> target_str;
    if(target_str != "-1")
    target_inp = stoul(target_str, nullptr, 2);

    cin >> movenum_min >> movenum_max >> operationnum_min >> operationnum_max >> req_operationnum;
    assert(1 <= movenum_min && movenum_min <= movenum_max);
    assert(1 <= operationnum_min && operationnum_min <= operationnum_max);
    assert(1 <= problemnum);
    assert(1 <= dightnum);

    vector<dataset> dataset_vec;
    vector<pair<string,unsigned int>> operation_inp;
    for(int i = 0; i < req_operationnum; i++){
        string ope;
        cin >> ope; 
        for(int j = 0; j < moreinf_operation.size(); j++){
            if(ope == moreinf_operation[j]){
                string input;
                cin >> input;
                unsigned int value = stoul(input, nullptr, 2);
                operation_inp.push_back(make_pair(ope, value));
                break;
            }
            if(j == moreinf_operation.size() - 1){
                operation_inp.push_back({ope, -1});
            }
        }
    }

    // 問題の生成をproblemnum回繰り返す
    while(problemnum){
        int start;
        int target;
        while(true){
            if(start_str == "-1") start = rand_range(0, (1 << dightnum) - 1);
            else start = start_inp;
            if(target_str == "-1") target = rand_range(0, (1 << dightnum) - 1);
            else target = target_inp;
            if(start != target)break;
        }
        vector<pair<string,unsigned int>> operation = operation_inp;
        
        // 手数・操作数・初期値・全ての操作の決定
        int movenum = rand_range(movenum_min, movenum_max);
        int operationnum = rand_range(operationnum_min, operationnum_max);
        int add_operationnum = operationnum - req_operationnum;
        assert(add_operationnum >= 0);

        vector<int> operation_index;
        for(int i = 0; i < add_operationnum; i++){
            operation_index.push_back(rand_range(0, all_operation.size() - 1));
        }

        for(int i = 0; i < operation_index.size(); i++){
            for(int j = 0; j < moreinf_operation.size(); j++){
                if(all_operation[operation_index[i]] == moreinf_operation[j]){
                    unsigned int value = rand_range(0, (1 << dightnum) - 1);
                    operation.push_back(make_pair(all_operation[operation_index[j]], value));
                    break;
                }
                if(j == moreinf_operation.size() - 1){
                    operation.push_back(make_pair(all_operation[operation_index[j]], -1));
                }
            }
        }
        mt19937 get_rand_mt;
        shuffle(operation.begin(), operation.end(), get_rand_mt); // 操作列をランダムにする

        // solverに解いてもらう
        set<int> counted;
        vector<int> result = solver(dightnum, operationnum, start, target, operation, counted, operationnum_max+1);
        if(result.size() == 0)continue;
        if(operationnum_min > result.size() || result.size() < operationnum_max)continue;

        //dataset_vecに情報を加える．
        dataset d = {dightnum, start, target, operationnum, operation, (int)result.size(), result};
        dataset_vec.push_back(d);
        problemnum--;

    }// problemnumのループ

    //出力
    int inc = 0;
    for(dataset d : dataset_vec){
        cout << "<Problem " << inc + 1 << ">" << endl;
        cout << "bit_length : "<< d.dightnum << endl;
        cout << "start : "<< d.start << endl;
        cout << "target : "<< d.target << endl;
        cout << "operation_count : "<< d.operationnum << endl;
        for(int j = 0; j < d.operation.size(); j++){
            cout << d.operation[j].first << " ";
            for(int k = 0; k < moreinf_operation.size(); k++){
                if(d.operation[j].first == moreinf_operation[k]){
                    bitset<sizeof(unsigned int) * 8> b(d.operation[j].second);
                    string s = b.to_string();
                    cout << s.substr(sizeof(unsigned int) * 8 - dightnum);
                    break;
                }
            }
            cout << endl;
        }
        cout << "turn_min : " << d.turn_min << endl;
        for(int j = 0; j < d.optimal_operation.size(); j++){
            cout << "operation " << j + 1 << " : " <<  d.optimal_operation[j] << endl;
        }
        inc++;
        cout << endl;
    }
    
    return 0;
}