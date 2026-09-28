/**
 * ============================================================================
 * TRIKI STUDIO PRO • MASTER ENGINE, STEREO AUDIO & HAPTIC CONTROLLER
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. SINTETIZADOR DE AUDIO HIFI CON PANNING ESTÉREO (WEB AUDIO API)
   ============================================================================ */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled;
    return this.enabled;
  }

  playMove(player, cellIndex = 4) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      // Cálculo de panorama estéreo según la columna del tablero (0=izq, 1=centro, 2=der)
      const col = cellIndex % 3;
      const panValue = col === 0 ? -0.4 : (col === 2 ? 0.4 : 0);

      const baseFreq = player === 'X' ? 580 : 440;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(panValue, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.15, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playTie() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.23];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.1, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.2);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.07);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }
}

/* ============================================================================
   2. MOTOR DE CONFETI EN CANVAS NATIVO
   ============================================================================ */
class ConfettiFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(winner) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.resize();
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const paletteX = ['#818cf8', '#6366f1', '#38bdf8', '#fafafa'];
    const paletteO = ['#fb7185', '#f43f5e', '#fbbf24', '#fafafa'];
    const colors = winner === 'X' ? paletteX : paletteO;

    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() * 60 - 30),
        y: this.canvas.height / 2 + (Math.random() * 30 - 15),
        w: Math.random() * 7 + 4,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 12 - 3,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.32,
        drag: 0.98,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.009
      });
    }

    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(p.alpha, 0);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

/* ============================================================================
   3. GESTOR DE ALMACENAMIENTO Y PERSISTENCIA
   ============================================================================ */
class StorageManager {
  static KEYS = {
    SCORES: 'triki_studio_scores_v3',
    THEME: 'triki_studio_theme_v3',
    SOUND: 'triki_studio_sound_v3',
    MODE: 'triki_studio_mode_v3',
    DIFFICULTY: 'triki_studio_difficulty_v3',
    STARTER: 'triki_studio_starter_v3',
    HISTORY: 'triki_studio_history_v3',
    NAME_X: 'triki_studio_name_x',
    NAME_O: 'triki_studio_name_o'
  };

  static getScores() {
    try {
      const raw = localStorage.getItem(this.KEYS.SCORES);
      return raw ? JSON.parse(raw) : { x: 0, o: 0, ties: 0, streak: 0, streakPlayer: null };
    } catch {
      return { x: 0, o: 0, ties: 0, streak: 0, streakPlayer: null };
    }
  }

  static saveScores(scores) {
    try {
      localStorage.setItem(this.KEYS.SCORES, JSON.stringify(scores));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  static getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'midnight-indigo';
  }

  static saveTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  }

  static getSound() {
    const val = localStorage.getItem(this.KEYS.SOUND);
    return val !== null ? val === 'true' : true;
  }

  static saveSound(enabled) {
    localStorage.setItem(this.KEYS.SOUND, String(enabled));
  }

  static getHistory() {
    try {
      const raw = localStorage.getItem(this.KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static addHistory(match) {
    try {
      const history = this.getHistory();
      history.unshift(match);
      if (history.length > 8) history.pop();
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  static clearHistory() {
    localStorage.removeItem(this.KEYS.HISTORY);
  }

  static getNames() {
    return {
      x: localStorage.getItem(this.KEYS.NAME_X) || 'Jugador 1',
      o: localStorage.getItem(this.KEYS.NAME_O) || 'Jugador 2'
    };
  }

  static saveNames(nameX, nameO) {
    if (nameX) localStorage.setItem(this.KEYS.NAME_X, nameX);
    if (nameO) localStorage.setItem(this.KEYS.NAME_O, nameO);
  }
}

/* ============================================================================
   4. INTELIGENCIA ARTIFICIAL MINIMAX
   ============================================================================ */
class MinimaxAI {
  static WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  static getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) moves.push(i);
    }
    return moves;
  }

  static checkWinner(board) {
    for (const [a, b, c] of this.WINNING_COMBOS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell !== null)) {
      return 'tie';
    }
    return null;
  }

  static getEasyMove(board) {
    const available = this.getAvailableMoves(board);
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  static getMediumMove(board, aiPlayer, humanPlayer) {
    const available = this.getAvailableMoves(board);

    for (const move of available) {
      board[move] = aiPlayer;
      if (this.checkWinner(board) === aiPlayer) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    if (Math.random() < 0.75) {
      for (const move of available) {
        board[move] = humanPlayer;
        if (this.checkWinner(board) === humanPlayer) {
          board[move] = null;
          return move;
        }
        board[move] = null;
      }
    }

    if (board[4] === null && Math.random() < 0.6) {
      return 4;
    }

    return this.getEasyMove(board);
  }

  static getUnbeatableMove(board, aiPlayer, humanPlayer) {
    let bestScore = -Infinity;
    let bestMove = null;
    const available = this.getAvailableMoves(board);

    if (available.length === 9) {
      const openings = [0, 2, 4, 6, 8];
      return openings[Math.floor(Math.random() * openings.length)];
    }

    for (const move of available) {
      board[move] = aiPlayer;
      const score = this.minimax(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove !== null ? bestMove : available[0];
  }

  static minimax(board, depth, isMaximizing, aiPlayer, humanPlayer, alpha, beta) {
    const result = this.checkWinner(board);

    if (result === aiPlayer) return 10 - depth;
    if (result === humanPlayer) return depth - 10;
    if (result === 'tie') return 0;

    const available = this.getAvailableMoves(board);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of available) {
        board[move] = aiPlayer;
        const evaluation = this.minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
        board[move] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of available) {
        board[move] = humanPlayer;
        const evaluation = this.minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
        board[move] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}

/* ============================================================================
   5. CONTROLADOR MAESTRO STUDIO PRO
   ============================================================================ */
class TrikiApp {
  static COORDS = [
    { code: 'A1', label: 'Superior Izquierda' },
    { code: 'A2', label: 'Superior Centro' },
    { code: 'A3', label: 'Superior Derecha' },
    { code: 'B1', label: 'Centro Izquierda' },
    { code: 'B2', label: 'Centro' },
    { code: 'B3', label: 'Centro Derecha' },
    { code: 'C1', label: 'Inferior Izquierda' },
    { code: 'C2', label: 'Inferior Centro' },
    { code: 'C3', label: 'Inferior Derecha' }
  ];

  static NUMPAD_MAP = {
    '7': 0, '8': 1, '9': 2,
    '4': 3, '5': 4, '6': 5,
    '1': 6, '2': 7, '3': 8
  };

  constructor() {
    this.board = Array(9).fill(null);
    this.historyStack = []; // Pila de jugadas para 'Deshacer'
    this.currentPlayer = 'X';
    this.isGameActive = true;
    this.turnCount = 0;
    this.roundCount = 1;

    this.playerNames = StorageManager.getNames();
    this.gameMode = 'pvp';
    this.difficulty = 'unbeatable';
    this.starterChoice = 'X';
    this.aiThinking = false;
    this.lastWinningCombo = null;

    this.sound = new SoundFX();
    this.confetti = new ConfettiFX('confettiCanvas');
    this.scores = StorageManager.getScores();

    this.dom = {
      cells: Array.from(document.querySelectorAll('.grid-cell')),
      boardGrid: document.getElementById('boardGrid'),
      winLine: document.getElementById('winLine'),
      winLineSvg: document.getElementById('winLineSvg'),
      statusText: document.getElementById('statusText'),
      statusBanner: document.getElementById('gameStatusBanner'),
      scoreX: document.getElementById('scoreX'),
      scoreO: document.getElementById('scoreO'),
      scoreTies: document.getElementById('scoreTies'),
      streakCount: document.getElementById('streakCount'),
      cardX: document.getElementById('cardPlayerX'),
      cardO: document.getElementById('cardPlayerO'),
      nameX: document.getElementById('namePlayerX'),
      nameO: document.getElementById('namePlayerO'),
      editNameXBtn: document.getElementById('editNameXBtn'),
      editNameOBtn: document.getElementById('editNameOBtn'),
      roleO: document.getElementById('rolePlayerO'),
      legendLabelX: document.getElementById('legendLabelX'),
      legendLabelO: document.getElementById('legendLabelO'),
      modePvpBtn: document.getElementById('modePvpBtn'),
      modeAiBtn: document.getElementById('modeAiBtn'),
      difficultyGroup: document.getElementById('difficultyGroup'),
      diffSelect: document.getElementById('diffSelect'),
      starterSelect: document.getElementById('starterSelect'),
      restartBtn: document.getElementById('restartBtn'),
      undoBtn: document.getElementById('undoBtn'),
      resetScoresBtn: document.getElementById('resetScoresBtn'),
      shareSummaryBtn: document.getElementById('shareSummaryBtn'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      soundIconOn: document.getElementById('soundIconOn'),
      soundIconOff: document.getElementById('soundIconOff'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      themeMenu: document.getElementById('themeMenu'),
      themeOptions: Array.from(document.querySelectorAll('.theme-option')),
      historyModalBtn: document.getElementById('historyModalBtn'),
      historyModal: document.getElementById('historyModal'),
      closeHistoryBtn: document.getElementById('closeHistoryBtn'),
      historyList: document.getElementById('historyList'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      totalRoundsBadge: document.getElementById('totalRoundsBadge'),
      barX: document.getElementById('barX'),
      barTie: document.getElementById('barTie'),
      barO: document.getElementById('barO'),
      pctX: document.getElementById('pctX'),
      pctTie: document.getElementById('pctTie'),
      pctO: document.getElementById('pctO'),
      moveLogContainer: document.getElementById('moveLogContainer'),
      logEmptyState: document.getElementById('logEmptyState'),
      moveTimeline: document.getElementById('moveTimeline'),
      toast: document.getElementById('toastNotification')
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.bindEvents();
    this.updateNamesUI();
    this.updateScoreboardDisplay();
    this.startNewRound(false);
  }

  loadSettings() {
    const savedTheme = StorageManager.getTheme();
    this.setTheme(savedTheme);

    const soundEnabled = StorageManager.getSound();
    this.sound.toggle(soundEnabled);
    this.updateSoundIcon();

    const savedDiff = localStorage.getItem(StorageManager.KEYS.DIFFICULTY);
    if (savedDiff) {
      this.difficulty = savedDiff;
      this.dom.diffSelect.value = savedDiff;
    }

    const savedStarter = localStorage.getItem(StorageManager.KEYS.STARTER);
    if (savedStarter) {
      this.starterChoice = savedStarter;
      this.dom.starterSelect.value = savedStarter;
    }

    const savedMode = localStorage.getItem(StorageManager.KEYS.MODE);
    if (savedMode) {
      this.setGameMode(savedMode);
    }
  }

  bindEvents() {
    this.dom.cells.forEach((cell, idx) => {
      cell.addEventListener('click', () => this.handleCellClick(idx));
      cell.addEventListener('keydown', (e) => this.handleCellKeyDown(e, idx));
    });

    this.dom.modePvpBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.setGameMode('pvp');
    });

    this.dom.modeAiBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.setGameMode('ai');
    });

    this.dom.diffSelect.addEventListener('change', (e) => {
      this.difficulty = e.target.value;
      localStorage.setItem(StorageManager.KEYS.DIFFICULTY, this.difficulty);
      this.sound.playClick();
      this.startNewRound(false);
    });

    this.dom.starterSelect.addEventListener('change', (e) => {
      this.starterChoice = e.target.value;
      localStorage.setItem(StorageManager.KEYS.STARTER, this.starterChoice);
      this.sound.playClick();
      this.startNewRound(false);
    });

    this.dom.restartBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.startNewRound(true);
    });

    this.dom.undoBtn.addEventListener('click', () => {
      this.handleUndoMove();
    });

    this.dom.resetScoresBtn.addEventListener('click', () => {
      this.sound.playClick();
      if (confirm('¿Deseas reiniciar los puntajes y rachas acumuladas?')) {
        this.resetScores();
      }
    });

    this.dom.shareSummaryBtn.addEventListener('click', () => {
      this.handleShareSummary();
    });

    this.dom.editNameXBtn.addEventListener('click', () => this.promptEditName('x'));
    this.dom.nameX.addEventListener('click', () => this.promptEditName('x'));

    this.dom.editNameOBtn.addEventListener('click', () => {
      if (this.gameMode === 'pvp') this.promptEditName('o');
    });
    this.dom.nameO.addEventListener('click', () => {
      if (this.gameMode === 'pvp') this.promptEditName('o');
    });

    this.dom.soundToggleBtn.addEventListener('click', () => {
      const state = this.sound.toggle();
      StorageManager.saveSound(state);
      this.updateSoundIcon();
      if (state) this.sound.playClick();
    });

    this.dom.themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.playClick();
      this.toggleThemeMenu();
    });

    this.dom.themeMenu.addEventListener('keydown', (e) => this.handleThemeMenuKeyDown(e));

    document.addEventListener('click', (e) => {
      if (!this.dom.themeMenu.contains(e.target) && e.target !== this.dom.themeToggleBtn) {
        this.closeThemeMenu();
      }
    });

    // ATAJOS DE TECLADO GLOBALES
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

      const key = e.key.toUpperCase();

      const numpadDigit = e.key.replace('Numpad', '');
      if (TrikiApp.NUMPAD_MAP.hasOwnProperty(numpadDigit)) {
        const cellIndex = TrikiApp.NUMPAD_MAP[numpadDigit];
        this.handleCellClick(cellIndex);
        return;
      }

      if (key === 'R') {
        e.preventDefault();
        this.sound.playClick();
        this.startNewRound(true);
      } else if (key === 'Z' || (e.ctrlKey && key === 'Z') || (e.metaKey && key === 'Z')) {
        e.preventDefault();
        this.handleUndoMove();
      } else if (key === 'M') {
        e.preventDefault();
        const state = this.sound.toggle();
        StorageManager.saveSound(state);
        this.updateSoundIcon();
        if (state) this.sound.playClick();
      } else if (key === 'T') {
        e.preventDefault();
        this.cycleNextTheme();
      } else if (key === 'H') {
        e.preventDefault();
        this.sound.playClick();
        this.openHistoryModal();
      } else if (e.key === 'Escape') {
        if (!this.dom.themeMenu.classList.contains('hidden')) {
          this.closeThemeMenu();
          this.dom.themeToggleBtn.focus();
        }
        if (!this.dom.historyModal.classList.contains('hidden')) {
          this.closeHistoryModal();
          this.dom.historyModalBtn.focus();
        }
      }
    });

    this.dom.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-theme-val');
        this.setTheme(theme);
        this.sound.playClick();
        this.closeThemeMenu();
        this.dom.themeToggleBtn.focus();
      });
    });

    this.dom.historyModalBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.openHistoryModal();
    });

    this.dom.closeHistoryBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeHistoryModal();
      this.dom.historyModalBtn.focus();
    });

    this.dom.historyModal.addEventListener('click', (e) => {
      if (e.target === this.dom.historyModal) {
        this.closeHistoryModal();
        this.dom.historyModalBtn.focus();
      }
    });

    this.dom.clearHistoryBtn.addEventListener('click', () => {
      this.sound.playClick();
      StorageManager.clearHistory();
      this.renderHistoryList();
    });

    window.addEventListener('resize', () => {
      if (this.lastWinningCombo) {
        this.drawWinningLine(this.lastWinningCombo);
      }
    });
  }

  showToast(message) {
    this.dom.toast.textContent = message;
    this.dom.toast.classList.remove('hidden');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.add('hidden');
    }, 2400);
  }

  promptEditName(playerKey) {
    const currentName = playerKey === 'x' ? this.playerNames.x : this.playerNames.o;
    const newName = prompt(`Ingresa el nombre para ${playerKey === 'x' ? 'Ficha X' : 'Ficha O'}:`, currentName);
    if (newName && newName.trim().length > 0) {
      const sanitized = newName.trim().slice(0, 16);
      if (playerKey === 'x') this.playerNames.x = sanitized;
      else this.playerNames.o = sanitized;
      StorageManager.saveNames(this.playerNames.x, this.playerNames.o);
      this.updateNamesUI();
      this.updateStatusBanner();
      this.showToast(`Nombre actualizado: ${sanitized}`);
    }
  }

  updateNamesUI() {
    this.dom.nameX.textContent = this.playerNames.x;
    this.dom.legendLabelX.textContent = `${this.playerNames.x}:`;

    if (this.gameMode === 'pvp') {
      this.dom.nameO.textContent = this.playerNames.o;
      this.dom.legendLabelO.textContent = `${this.playerNames.o}:`;
      this.dom.editNameOBtn.classList.remove('hidden');
    } else {
      this.dom.nameO.textContent = 'Bot IA';
      this.dom.legendLabelO.textContent = 'Bot IA:';
      this.dom.editNameOBtn.classList.add('hidden');
    }
  }

  handleShareSummary() {
    const total = this.scores.x + this.scores.o + this.scores.ties;
    const nameX = this.playerNames.x;
    const nameO = this.gameMode === 'ai' ? 'Bot IA' : this.playerNames.o;

    const summaryText = `🎮 Triki Studio Pro\n🏆 ${nameX}: ${this.scores.x} | ${nameO}: ${this.scores.o} | Empates: ${this.scores.ties}\n🔥 Racha activa: ${this.scores.streak} (${this.scores.streakPlayer || '-'})\n📊 Total rondas: ${total}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText).then(() => {
        this.sound.playClick();
        this.showToast('📋 Resumen copiado al portapapeles');
      }).catch(() => {
        this.showToast('No se pudo copiar automáticamente.');
      });
    } else {
      alert(summaryText);
    }
  }

  // DESHACER JUGADA (UNDO TÁCTICO)
  handleUndoMove() {
    if (!this.isGameActive || this.historyStack.length === 0 || this.aiThinking) {
      return;
    }

    this.sound.playClick();

    if (this.gameMode === 'ai') {
      // En modo IA deshará la jugada del bot Y la última jugada del humano
      const lastAiMove = this.historyStack.pop();
      if (lastAiMove !== undefined) {
        this.board[lastAiMove.index] = null;
        this.resetCellDOM(lastAiMove.index);
        this.popMoveTimelineDOM();
      }

      const lastHumanMove = this.historyStack.pop();
      if (lastHumanMove !== undefined) {
        this.board[lastHumanMove.index] = null;
        this.resetCellDOM(lastHumanMove.index);
        this.popMoveTimelineDOM();
      }

      this.currentPlayer = 'X';
      this.turnCount = this.historyStack.length;
    } else {
      // En modo 2 jugadores deshace el turno anterior
      const lastMove = this.historyStack.pop();
      if (lastMove !== undefined) {
        this.board[lastMove.index] = null;
        this.resetCellDOM(lastMove.index);
        this.popMoveTimelineDOM();
        this.currentPlayer = lastMove.player;
        this.turnCount = this.historyStack.length;
      }
    }

    this.updateUndoButtonState();
    this.updateBoardTurnClass();
    this.updateActivePlayerCard();
    this.updateStatusBanner();
    this.showToast('Jugada revertida');
  }

  resetCellDOM(index) {
    const cell = this.dom.cells[index];
    cell.innerHTML = `<span class="coord-badge" aria-hidden="true">${TrikiApp.COORDS[index].code}</span>`;
    cell.className = 'grid-cell';
    cell.setAttribute('aria-label', `Casilla ${index + 1} (${TrikiApp.COORDS[index].code}), vacía`);
  }

  popMoveTimelineDOM() {
    if (this.dom.moveTimeline.lastElementChild) {
      this.dom.moveTimeline.removeChild(this.dom.moveTimeline.lastElementChild);
    }
    if (this.dom.moveTimeline.children.length === 0) {
      this.dom.moveTimeline.classList.add('hidden');
      this.dom.logEmptyState.classList.remove('hidden');
    }
  }

  updateUndoButtonState() {
    this.dom.undoBtn.disabled = !(this.isGameActive && this.historyStack.length > 0 && !this.aiThinking);
  }

  cycleNextTheme() {
    const themes = ['midnight-indigo', 'slate-emerald', 'nordic-light'];
    const current = StorageManager.getTheme();
    const currentIndex = themes.indexOf(current);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.setTheme(nextTheme);
    this.sound.playClick();
  }

  toggleThemeMenu() {
    const isHidden = this.dom.themeMenu.classList.contains('hidden');
    if (isHidden) {
      this.openThemeMenu();
    } else {
      this.closeThemeMenu();
    }
  }

  openThemeMenu() {
    this.dom.themeMenu.classList.remove('hidden');
    this.dom.themeToggleBtn.setAttribute('aria-expanded', 'true');
    const activeOpt = this.dom.themeOptions.find(opt => opt.classList.contains('active')) || this.dom.themeOptions[0];
    if (activeOpt) activeOpt.focus();
  }

  closeThemeMenu() {
    this.dom.themeMenu.classList.add('hidden');
    this.dom.themeToggleBtn.setAttribute('aria-expanded', 'false');
  }

  handleThemeMenuKeyDown(e) {
    const activeIndex = this.dom.themeOptions.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % this.dom.themeOptions.length;
      this.dom.themeOptions[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (activeIndex - 1 + this.dom.themeOptions.length) % this.dom.themeOptions.length;
      this.dom.themeOptions[prevIndex].focus();
    }
  }

  setGameMode(mode) {
    this.gameMode = mode;
    localStorage.setItem(StorageManager.KEYS.MODE, mode);

    if (mode === 'pvp') {
      this.dom.modePvpBtn.classList.add('active');
      this.dom.modePvpBtn.setAttribute('aria-checked', 'true');
      this.dom.modeAiBtn.classList.remove('active');
      this.dom.modeAiBtn.setAttribute('aria-checked', 'false');
      this.dom.difficultyGroup.classList.add('hidden');
      this.dom.roleO.textContent = 'Ficha O';
    } else {
      this.dom.modeAiBtn.classList.add('active');
      this.dom.modeAiBtn.setAttribute('aria-checked', 'true');
      this.dom.modePvpBtn.classList.remove('active');
      this.dom.modePvpBtn.setAttribute('aria-checked', 'false');
      this.dom.difficultyGroup.classList.remove('hidden');
      this.dom.roleO.textContent = this.getDifficultyLabel();
    }

    this.updateNamesUI();
    this.startNewRound(false);
  }

  getDifficultyLabel() {
    switch (this.difficulty) {
      case 'easy': return 'IA Casual';
      case 'medium': return 'IA Táctica';
      case 'unbeatable': default: return 'IA Minimax';
    }
  }

  setTheme(themeName) {
    let normalized = themeName;
    if (themeName === 'cyber-neon') normalized = 'midnight-indigo';
    if (themeName === 'luxury-gold') normalized = 'slate-emerald';
    if (themeName === 'clean-glass') normalized = 'nordic-light';

    document.documentElement.setAttribute('data-theme', normalized);
    StorageManager.saveTheme(normalized);

    let friendlyName = 'Midnight Indigo';
    if (normalized === 'slate-emerald') friendlyName = 'Slate Emerald';
    if (normalized === 'nordic-light') friendlyName = 'Nordic Minimal';

    this.dom.themeToggleBtn.setAttribute('aria-label', `Seleccionar paleta de color (actual: ${friendlyName})`);

    this.dom.themeOptions.forEach(opt => {
      const match = opt.getAttribute('data-theme-val') === normalized;
      if (match) {
        opt.classList.add('active');
        opt.setAttribute('aria-checked', 'true');
        opt.setAttribute('tabindex', '0');
      } else {
        opt.classList.remove('active');
        opt.setAttribute('aria-checked', 'false');
        opt.setAttribute('tabindex', '-1');
      }
    });
  }

  updateSoundIcon() {
    if (this.sound.enabled) {
      this.dom.soundIconOn.classList.remove('hidden');
      this.dom.soundIconOff.classList.add('hidden');
      this.dom.soundToggleBtn.setAttribute('title', 'Alternar Sonido (Atajo: M)');
      this.dom.soundToggleBtn.setAttribute('aria-label', 'Efectos de sonido activados. Presiona para silenciar.');
    } else {
      this.dom.soundIconOn.classList.add('hidden');
      this.dom.soundIconOff.classList.remove('hidden');
      this.dom.soundToggleBtn.setAttribute('title', 'Alternar Sonido (Atajo: M)');
      this.dom.soundToggleBtn.setAttribute('aria-label', 'Efectos de sonido silenciados. Presiona para activar.');
    }
  }

  startNewRound(isManual = false) {
    this.board = Array(9).fill(null);
    this.historyStack = [];
    this.isGameActive = true;
    this.aiThinking = false;
    this.turnCount = 0;
    this.lastWinningCombo = null;

    if (isManual) {
      this.roundCount++;
    }

    if (this.starterChoice === 'alternate') {
      this.currentPlayer = (this.roundCount % 2 === 1) ? 'X' : 'O';
    } else {
      this.currentPlayer = this.starterChoice;
    }

    this.dom.cells.forEach((cell, idx) => {
      this.resetCellDOM(idx);
    });

    this.dom.boardGrid.classList.remove('game-over');
    this.clearWinningLine();
    this.updateUndoButtonState();
    this.updateBoardTurnClass();
    this.updateActivePlayerCard();
    this.updateStatusBanner();
    this.resetMoveLogUI();

    if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
      this.triggerAiMove();
    }
  }

  handleCellClick(index) {
    if (!this.isGameActive || this.aiThinking) return;

    if (this.board[index] !== null) {
      this.sound.playError();
      if ('vibrate' in navigator) navigator.vibrate(30);
      const cell = this.dom.cells[index];
      cell.classList.remove('shake');
      void cell.offsetWidth;
      cell.classList.add('shake');
      return;
    }

    this.makeMove(index, this.currentPlayer);
  }

  handleCellKeyDown(e, index) {
    const key = e.key;
    let targetIndex = null;

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.handleCellClick(index);
      return;
    }

    if (key === 'ArrowRight' && index % 3 < 2) targetIndex = index + 1;
    if (key === 'ArrowLeft' && index % 3 > 0) targetIndex = index - 1;
    if (key === 'ArrowDown' && index < 6) targetIndex = index + 3;
    if (key === 'ArrowUp' && index > 2) targetIndex = index - 3;

    if (targetIndex !== null) {
      e.preventDefault();
      this.dom.cells[targetIndex].focus();
    }
  }

  getTokenSvg(player) {
    if (player === 'X') {
      return `<svg class="cell-svg-token" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    }
    return `<svg class="cell-svg-token" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><circle cx="12" cy="12" r="7"></circle></svg>`;
  }

  makeMove(index, player) {
    this.board[index] = player;
    this.turnCount++;
    this.historyStack.push({ index, player, turn: this.turnCount });

    const cell = this.dom.cells[index];
    cell.innerHTML = this.getTokenSvg(player);
    cell.classList.add('taken', player === 'X' ? 'x-mark' : 'o-mark');
    cell.setAttribute('aria-label', `Casilla ${index + 1} (${TrikiApp.COORDS[index].code}) marcada por ${player}`);

    this.sound.playMove(player, index);
    if ('vibrate' in navigator) navigator.vibrate(15);
    this.recordMoveNotation(index, player);
    this.updateUndoButtonState();

    const winnerData = this.checkWinCondition();

    if (winnerData) {
      this.handleGameOver(winnerData.winner, winnerData.combo);
      return;
    }

    if (this.board.every(c => c !== null)) {
      this.handleGameOver('tie', null);
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateBoardTurnClass();
    this.updateActivePlayerCard();
    this.updateStatusBanner();

    if (this.gameMode === 'ai' && this.currentPlayer === 'O' && this.isGameActive) {
      this.triggerAiMove();
    }
  }

  recordMoveNotation(index, player) {
    const coord = TrikiApp.COORDS[index];
    this.dom.logEmptyState.classList.add('hidden');
    this.dom.moveTimeline.classList.remove('hidden');

    const item = document.createElement('div');
    item.className = 'move-item';
    const tagClass = player === 'X' ? 'move-tag-x' : 'move-tag-o';
    const playerName = player === 'X' ? this.playerNames.x : (this.gameMode === 'ai' ? 'Bot IA' : this.playerNames.o);

    item.innerHTML = `
      <div class="move-left">
        <span class="move-turn-num">#${this.turnCount}</span>
        <span class="move-player-tag ${tagClass}">${player}</span>
        <span>${playerName}</span>
      </div>
      <div class="move-coord">
        <span>${coord.code} • ${coord.label}</span>
      </div>
    `;

    this.dom.moveTimeline.appendChild(item);
    this.dom.moveLogContainer.scrollTop = this.dom.moveLogContainer.scrollHeight;
  }

  resetMoveLogUI() {
    this.dom.moveTimeline.innerHTML = '';
    this.dom.moveTimeline.classList.add('hidden');
    this.dom.logEmptyState.classList.remove('hidden');
  }

  triggerAiMove() {
    this.aiThinking = true;
    this.updateUndoButtonState();
    this.dom.boardGrid.style.pointerEvents = 'none';
    this.updateStatusBanner('IA calculando...');

    setTimeout(() => {
      if (!this.isGameActive) return;

      let chosenMove = null;
      if (this.difficulty === 'easy') {
        chosenMove = MinimaxAI.getEasyMove(this.board);
      } else if (this.difficulty === 'medium') {
        chosenMove = MinimaxAI.getMediumMove(this.board, 'O', 'X');
      } else {
        chosenMove = MinimaxAI.getUnbeatableMove(this.board, 'O', 'X');
      }

      this.aiThinking = false;
      this.dom.boardGrid.style.pointerEvents = 'auto';

      if (chosenMove !== null) {
        this.makeMove(chosenMove, 'O');
      }
      this.updateUndoButtonState();
    }, 320);
  }

  checkWinCondition() {
    for (const combo of MinimaxAI.WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return { winner: this.board[a], combo };
      }
    }
    return null;
  }

  handleGameOver(winner, combo) {
    this.isGameActive = false;
    this.dom.boardGrid.classList.add('game-over');
    this.updateUndoButtonState();

    if (winner === 'tie') {
      this.scores.ties++;
      this.scores.streak = 0;
      this.scores.streakPlayer = null;
      this.sound.playTie();
      if ('vibrate' in navigator) navigator.vibrate([20, 50, 20]);
      this.updateStatusBanner('Empate técnico', 'tie');
      this.recordMatchResult('tie');
    } else {
      this.lastWinningCombo = combo;
      if (winner === 'X') {
        this.scores.x++;
        if (this.scores.streakPlayer === 'X') {
          this.scores.streak++;
        } else {
          this.scores.streak = 1;
          this.scores.streakPlayer = 'X';
        }
      } else {
        this.scores.o++;
        if (this.scores.streakPlayer === 'O') {
          this.scores.streak++;
        } else {
          this.scores.streak = 1;
          this.scores.streakPlayer = 'O';
        }
      }

      combo.forEach(idx => {
        this.dom.cells[idx].classList.add('winning-cell');
      });

      this.drawWinningLine(combo);
      this.sound.playWin();
      if ('vibrate' in navigator) navigator.vibrate([30, 60, 30]);
      this.confetti.launch(winner);

      const winnerName = winner === 'X' ? this.playerNames.x : (this.gameMode === 'ai' ? 'Bot IA' : this.playerNames.o);
      this.updateStatusBanner(`Victoria de ${winnerName}`, winner === 'X' ? 'winner-x' : 'winner-o');
      this.recordMatchResult(winner);
    }

    StorageManager.saveScores(this.scores);
    this.updateScoreboardDisplay();
  }

  drawWinningLine(combo) {
    const firstCell = this.dom.cells[combo[0]];
    const lastCell = this.dom.cells[combo[2]];
    const boardRect = this.dom.boardGrid.getBoundingClientRect();

    const rect1 = firstCell.getBoundingClientRect();
    const rect2 = lastCell.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - boardRect.left;
    const y1 = rect1.top + rect1.height / 2 - boardRect.top;
    const x2 = rect2.left + rect2.width / 2 - boardRect.left;
    const y2 = rect2.top + rect2.height / 2 - boardRect.top;

    this.dom.winLine.setAttribute('x1', x1);
    this.dom.winLine.setAttribute('y1', y1);
    this.dom.winLine.setAttribute('x2', x2);
    this.dom.winLine.setAttribute('y2', y2);

    const winner = this.board[combo[0]];
    const color = winner === 'X' ? 'var(--player-x-border)' : 'var(--player-o-border)';
    this.dom.winLine.style.stroke = color;

    const length = Math.hypot(x2 - x1, y2 - y1);
    this.dom.winLine.style.strokeDasharray = length;
    this.dom.winLine.style.strokeDashoffset = length;

    requestAnimationFrame(() => {
      this.dom.winLine.style.strokeDashoffset = '0';
    });
  }

  clearWinningLine() {
    this.dom.winLine.style.strokeDashoffset = '600';
  }

  updateBoardTurnClass() {
    this.dom.boardGrid.classList.remove('turn-x', 'turn-o');
    if (this.isGameActive) {
      this.dom.boardGrid.classList.add(this.currentPlayer === 'X' ? 'turn-x' : 'turn-o');
    }
  }

  updateActivePlayerCard() {
    if (!this.isGameActive) {
      this.dom.cardX.classList.remove('active-turn');
      this.dom.cardO.classList.remove('active-turn');
      return;
    }

    if (this.currentPlayer === 'X') {
      this.dom.cardX.classList.add('active-turn');
      this.dom.cardO.classList.remove('active-turn');
    } else {
      this.dom.cardO.classList.add('active-turn');
      this.dom.cardX.classList.remove('active-turn');
    }
  }

  updateStatusBanner(customText, statusClass) {
    this.dom.statusBanner.className = 'turn-status-bar';

    if (statusClass) {
      this.dom.statusBanner.classList.add(statusClass);
    }

    if (customText) {
      this.dom.statusText.innerHTML = customText;
      return;
    }

    if (this.currentPlayer === 'X') {
      this.dom.statusBanner.classList.add('turn-x');
      this.dom.statusText.innerHTML = `Turno de <strong>${this.playerNames.x}</strong>`;
    } else {
      this.dom.statusBanner.classList.add('turn-o');
      const name = this.gameMode === 'ai' ? 'Bot IA' : this.playerNames.o;
      this.dom.statusText.innerHTML = `Turno de <strong>${name}</strong>`;
    }
  }

  updateScoreboardDisplay() {
    this.dom.scoreX.textContent = this.scores.x;
    this.dom.scoreO.textContent = this.scores.o;
    this.dom.scoreTies.textContent = this.scores.ties;
    this.dom.streakCount.textContent = this.scores.streak;

    this.dom.cardX.setAttribute('aria-label', `Puntuación ${this.playerNames.x} X: ${this.scores.x} victorias`);
    this.dom.cardO.setAttribute('aria-label', `Puntuación ${this.playerNames.o} O: ${this.scores.o} victorias`);

    const total = this.scores.x + this.scores.o + this.scores.ties;
    this.dom.totalRoundsBadge.textContent = `${total} ${total === 1 ? 'ronda' : 'rondas'}`;

    if (total === 0) {
      this.dom.barX.style.width = '33.33%';
      this.dom.barTie.style.width = '33.33%';
      this.dom.barO.style.width = '33.34%';
      this.dom.pctX.textContent = '0%';
      this.dom.pctTie.textContent = '0%';
      this.dom.pctO.textContent = '0%';
    } else {
      const pX = Math.round((this.scores.x / total) * 100);
      const pTie = Math.round((this.scores.ties / total) * 100);
      const pO = Math.max(0, 100 - pX - pTie);

      this.dom.barX.style.width = `${pX}%`;
      this.dom.barTie.style.width = `${pTie}%`;
      this.dom.barO.style.width = `${pTie === 0 && pX === 0 ? 100 : pO}%`;

      this.dom.pctX.textContent = `${pX}%`;
      this.dom.pctTie.textContent = `${pTie}%`;
      this.dom.pctO.textContent = `${pO}%`;
    }
  }

  resetScores() {
    this.scores = { x: 0, o: 0, ties: 0, streak: 0, streakPlayer: null };
    StorageManager.saveScores(this.scores);
    this.updateScoreboardDisplay();
    this.startNewRound(false);
  }

  recordMatchResult(winner) {
    let winnerLabel = 'Empate';
    if (winner === 'X') winnerLabel = this.playerNames.x;
    else if (winner === 'O') winnerLabel = this.gameMode === 'ai' ? 'Bot IA' : this.playerNames.o;

    const match = {
      winner,
      winnerLabel,
      mode: this.gameMode === 'pvp' ? '2 Jugadores' : `IA (${this.difficulty})`,
      turns: this.turnCount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    StorageManager.addHistory(match);
  }

  openHistoryModal() {
    this.renderHistoryList();
    this.dom.historyModal.classList.remove('hidden');
    this.dom.closeHistoryBtn.focus();
  }

  closeHistoryModal() {
    this.dom.historyModal.classList.add('hidden');
  }

  renderHistoryList() {
    const history = StorageManager.getHistory();
    this.dom.historyList.innerHTML = '';

    if (history.length === 0) {
      this.dom.historyList.innerHTML = `<p class="empty-history-text" role="status">Sin partidas registradas todavía.</p>`;
      return;
    }

    history.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'history-row';
      el.setAttribute('role', 'listitem');

      let tagClass = 'badge-tie';
      let tagText = 'EMPATE';
      if (item.winner === 'X') {
        tagClass = 'badge-x';
        tagText = `GANA ${item.winnerLabel || 'X'}`;
      } else if (item.winner === 'O') {
        tagClass = 'badge-o';
        tagText = `GANA ${item.winnerLabel || 'O'}`;
      }

      el.innerHTML = `
        <div class="history-row-left">
          <span class="win-badge ${tagClass}" aria-label="Resultado: ${tagText}">${tagText}</span>
          <span>${item.mode}</span>
        </div>
        <div class="history-row-right">
          <span>${item.turns} turnos • ${item.timestamp}</span>
        </div>
      `;
      this.dom.historyList.appendChild(el);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.trikiApp = new TrikiApp();
});
