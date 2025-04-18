#include <bits/stdc++.h>
using namespace std;

template <typename T> inline bool chmax(T &a, T b) { return ((a < b) ? (a = b, true) : (false));}
template <typename T> inline bool chmin(T &a, T b) { return ((a > b) ? (a = b, true) : (false));}

int n;
unsigned int start;
int m;
unsigned int target;
vector<pair<string,unsigned int>> operation;
set<int> counted;

vector<int> bfs(int turn_limit){
    queue<pair<unsigned int, vector<int>>> que;
    vector<int> initial;
    que.push(make_pair(start,initial));
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

        for(int i=0; i<m; i++){
            int now = pr.first;
            if(operation[i].first == "and"){
                now &= operation[i].second;
                if(!counted.count(now)){
                pr.second.push_back(i+1);
                que.push(make_pair(now, pr.second));
                pr.second.pop_back();
                }
            }
            now = pr.first;
            if(operation[i].first == "or"){
                now |= operation[i].second;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                    }
            }
            now = pr.first;
            if(operation[i].first == "xor"){
                now ^= operation[i].second;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                    }
            }
            now = pr.first;
            if(operation[i].first == "not"){
                now = (1<<n) - 1 - now;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                    }
            }
            now = pr.first;
            if(operation[i].first == "lshift"){
                int dec = 0;
                if((now >> (n-1)) & 1) dec = (1<<(n));
                now *= 2;
                now -= dec;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                    }
            }
            now = pr.first;
            if(operation[i].first == "cyclic_lshift"){
                int dec = 0;
                if((now >> (n-1)) & 1) dec = (1<<(n)) - 1;
                now *= 2;
                now -= dec;
                if(!counted.count(now)){
                    pr.second.push_back(i+1);
                    que.push(make_pair(now, pr.second));
                    pr.second.pop_back();
                    }
            }
            now = pr.first;
            if(operation[i].first == "add"){
                now += operation[i].second;
                now %= (1<<n);
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

int main(){
    cin>>n;
    cin>>start;
    cin>>target;
    cin>>m;
    operation.resize(m);
    for(int i=0;i<m;i++){
        cin>>operation[i].first;
        cin>>operation[i].second;
    }
    int turn_limit = 10;

    vector<int> answer = bfs(turn_limit);
    int sz = answer.size();
    for(int i=0; i<sz; i++){
        cout<<(i+1)<<": operation "<<answer[i]<<endl;
    }
    return 0;
}