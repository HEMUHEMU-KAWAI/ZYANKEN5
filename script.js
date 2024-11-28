// 勝敗の記録を保存する変数
let moves = [];
let win = 0;
let lose = 0;
let draw = 0;
let games = 0; // 試合回数
let hundredGameStats = []; // 100試合ごとの記録を保存

// ランダムにコンピュータの手を選ぶ関数
function randomMove() {
    const moves = ["グー", "チョキ", "パー"];
    return moves[Math.floor(Math.random() * moves.length)];
}

// コンピュータの手を決定するロジック
function decideComputerMove(moves, order = 5) {
    if (moves.length < order) {
        return randomMove();
    }

    const predictedMove = predictNextMove(moves, order);
    const counterMoves = { "グー": "パー", "チョキ": "グー", "パー": "チョキ" };
    return counterMoves[predictedMove] || randomMove();
}

// マルコフ連鎖で次の手を予測
function predictNextMove(moves, order) {
    const state = moves.slice(-order).join(",");
    const transitionMatrix = buildTransitionMatrix(moves, order);

    if (transitionMatrix[state]) {
        const nextMoves = transitionMatrix[state];
        let maxMove = null;
        let maxCount = -1;

        for (const move in nextMoves) {
            if (nextMoves[move] > maxCount) {
                maxMove = move;
                maxCount = nextMoves[move];
            }
        }

        return maxMove;
    } else {
        return randomMove(); // データが不足している場合はランダム
    }
}

// 遷移行列を構築
function buildTransitionMatrix(moves, order) {
    const transitionMatrix = {};

    for (let i = 0; i < moves.length - order; i++) {
        const state = moves.slice(i, i + order).join(",");
        const nextMove = moves[i + order];

        if (!transitionMatrix[state]) {
            transitionMatrix[state] = { "グー": 0, "チョキ": 0, "パー": 0 };
        }

        transitionMatrix[state][nextMove]++;
    }

    return transitionMatrix;
}

// 勝敗の判定
function judge(player, computer) {
    if (player === computer) {
        return "draw";
    } else if (
        (player === "グー" && computer === "チョキ") ||
        (player === "チョキ" && computer === "パー") ||
        (player === "パー" && computer === "グー")
    ) {
        return "win";
    } else {
        return "lose";
    }
}

// 100試合ごとの記録を保存
function saveStatsEvery100Games() {
    if (games % 100 === 0) {
        const winRate = ((win / games) * 100).toFixed(2);
        hundredGameStats.push({
            gameNumber: games,
            win,
            lose,
            draw,
            winRate: `${winRate}%`
        });

        // 100試合ごとの統計を画面に表示
        displayHundredGameStats();

        console.log(`100試合ごとの統計: 試合数: ${games}, 勝ち: ${win}, 負け: ${lose}, 引き分け: ${draw}, 勝率: ${winRate}%`);
    }
}

// 100試合ごとの記録をHTMLに表示
function displayHundredGameStats() {
    const statsDiv = document.getElementById("hundred-game-stats");
    statsDiv.innerHTML = ""; // 前の内容をクリア

    hundredGameStats.forEach(stat => {
        const statEntry = document.createElement("div");
        statEntry.textContent = `試合数: ${stat.gameNumber}, 勝ち: ${stat.win}, 負け: ${stat.lose}, 引き分け: ${stat.draw}, 勝率: ${stat.winRate}`;
        statsDiv.appendChild(statEntry);
    });
}

// ゲームを実行
function playGame(playerMove) {
    const computerMove = decideComputerMove(moves);
    const result = judge(playerMove, computerMove);

    moves.push(playerMove);
    games++;

    if (result === "win") {
        win++;
    } else if (result === "lose") {
        lose++;
    } else {
        draw++;
    }

    // 結果を画面に更新
    document.getElementById("player-move").textContent = playerMove;
    document.getElementById("computer-move").textContent = computerMove;
    document.getElementById("result").textContent = result;
    document.getElementById("win-count").textContent = win;
    document.getElementById("lose-count").textContent = lose;
    document.getElementById("draw-count").textContent = draw;
    document.getElementById("games-count").textContent = games;

    // 100試合ごとの統計を保存
    saveStatsEvery100Games();
}

// ゲームのリセット
function resetGame() {
    moves = [];
    win = 0;
    lose = 0;
    draw = 0;
    games = 0;
    hundredGameStats = [];

    document.getElementById("player-move").textContent = "";
    document.getElementById("computer-move").textContent = "";
    document.getElementById("result").textContent = "";
    document.getElementById("win-count").textContent = 0;
    document.getElementById("lose-count").textContent = 0;
    document.getElementById("draw-count").textContent = 0;
    document.getElementById("games-count").textContent = 0;

    document.getElementById("hundred-game-stats").innerHTML = "";
}

// イベントリスナーを設定
document.getElementById("rock").addEventListener("click", () => playGame("グー"));
document.getElementById("scissors").addEventListener("click", () => playGame("チョキ"));
document.getElementById("paper").addEventListener("click", () => playGame("パー"));
document.getElementById("reset").addEventListener("click", resetGame);
