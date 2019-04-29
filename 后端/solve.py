#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Xiaobo Yang
@contact: hal_42@zju.edu.cn
@software: PyCharm
@file: solve.py
@time: 2019/4/27 18:01
@desc:
"""
from flask import jsonify
import json
import numpy as np

DepthLimit = 0

def Solve(req_data):
    board = req_data['_board']
    current_player = req_data['_current_player']
    difficulty = req_data['_difficulty']
    print(board)
    print(current_player, difficulty)

    global DepthLimit                    #!MUST BE GLOBAL
    DepthLimit = difficulty
    x, y = MiniminSearch(np.array(board))

    return jsonify({'x': x, 'y': y})

def MiniminSearch(current_state):
    """
    Search the next step by Minimax Search with depth limited strategy
    The search depth is limited to 3, computer player(1) uses circle(1) and you(-1) use cross(-1)
    :param current_state: current state of the game, it's a 3x3 array representing the chess board, array element lies
    in {1, -1, 0}, standing for circle, cross, empty place.
    :return: row and column index that computer player will draw a circle on. Note 0<=row<=2, 0<=col<=2
    """
    
    assert isinstance(current_state, np.ndarray)
    assert current_state.shape == (3, 3)

    # get available actions
    game_state = current_state.copy()
    actions = get_available_actions(game_state)

    # computer player: traverse all the possible actions and maximize the utility function
    values = []
    depth = 0
    for action in actions:
        values.append(max_value(action_result(game_state.copy(), action, -1), depth))
    min_ind = int(np.argmin(values))
    row, col = actions[min_ind][0], actions[min_ind][1]

    return row, col


def get_available_actions(current_state):
    """
    get all the available actions given current state
    :param current_state:current state of the game, it's a 3x3 array
    :return: available actions. list of tuple [(r0, c0), (r1, c1), (r2, c2)]
    """
    assert isinstance(current_state, np.ndarray), 'current_state should be numpy ndarray'
    assert current_state.shape == (3, 3), 'current_state: expect 3x3 array, get {}'.format(current_state.shape)

    available_actions = []
    for row in range(3):
        for col in range(3):
            if int(current_state[row][col]) == 0:
                available_actions.append((row, col))

    return available_actions


def action_result(current_state, action, player):
    """
    update the game state given the input action and player
    :param current_state: current state of the game, it's a 3x3 array
    :param action: current action, tuple type
    :param player:
    :return:
    """
    assert isinstance(current_state, np.ndarray), 'current_state should be numpy ndarray'
    assert current_state.shape == (3, 3), 'current_state: expect 3x3 array, get {}'.format(current_state.shape)
    assert player in [1, -1], 'player should be either 1(computer) or -1(you)'

    row, col = action
    current_state[row][col] = player
    return current_state


def min_value(current_state, depth):
    """
    recursively call min_value and max_value, min_value is for human player(-1)
    :param current_state:
    :param depth:
    :return:
    """
    current_utility = utility(current_state)

    actions = get_available_actions(current_state)
    if depth == DepthLimit or abs(current_utility) > 100 or len(actions) == 0:
        return current_utility

    values = []
    for action in actions:
        values.append(max_value(action_result(current_state.copy(), action, -1), depth + 1))

    return (np.array(values)).min()


def max_value(current_state, depth):
    """
    recursively call min_value and max_value, max_value is for computer(1)
    :param current_state:
    :param depth:
    :return:
    """
    actions = get_available_actions(current_state)
    current_utility = utility(current_state)

    if depth == DepthLimit or abs(current_utility) > 100 or len(actions) == 0:
        return current_utility

    values = []
    for action in actions:
        values.append(min_value(action_result(current_state.copy(), action, 1), depth + 1))
    return (np.array(values)).max()


def utility(current_state):
    """
    return utility function given current state and flag
    :param current_state:
    #:param flag:
    :return:
    """
    #current_state_l = list(current_state)

    diag1 = np.array([current_state[i][i] for i in range(3)]);
    diag2 = np.array([current_state[i][2-i] for i in range(3)]);
    diags = [diag1, diag2]

    X = [0] * 4
    O = [0] * 4

    for row in current_state:
        O[np.count_nonzero(row == 1)] += 1
        X[np.count_nonzero(row == -1)] += 1

    for col in current_state.T:
        O[np.count_nonzero(col == 1)] += 1
        X[np.count_nonzero(col == -1)] += 1

    for diag in diags:
        O[np.count_nonzero(diag == 1)] += 1
        X[np.count_nonzero(diag == -1)] += 1

    return O[3] * 10000 + O[2] * 3 + O[1] - (X[3] * 10000 + X[2] * 3 + X[1])

if __name__ == "__main__":
    DepthLimit = 3
    MiniminSearch(np.array(
        [
            [-1, 0, 1],
            [0, -1, 0],
            [0, 0, 1]
        ])
    )
