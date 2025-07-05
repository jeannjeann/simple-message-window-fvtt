# Simple Message Window (for FoundryVTT)

![Foundry v11](https://img.shields.io/badge/foundry-v11-green)
![Foundry v12](https://img.shields.io/badge/foundry-v12-green)
![Foundry v13](https://img.shields.io/badge/foundry-v13-green)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X415YUSP)
[![OFUSE](https://img.shields.io/badge/OFUSE-9cf.svg?style=for-the-badge)](https://ofuse.me/o?uid=81619)

シンプルなノベルゲーム風のメッセージウィンドウを表示するモジュール

Simple message window module like Novel game

## 特徴  Features

- 立ち絵とメッセージをシンプルなメッセージウィンドウに表示する
- 発言種別ごとにウィンドウへの表示・非表示を選択できる
- ウィンドウの位置、大きさ、透過度を設定できる
- 立ち絵の大きさ、透過度を設定できる
- フォントの大きさを設定できる
- 字送りの速度を設定できる
- 自動でウィンドウを閉じるまでの時間を設定できる

- Display character pictures and messages in a simple message window
- Display or not display in the window can be selected for each type of message.
- Set window position, size, and transparency.
- Size, transparency of the picture can be set.
- Font size can be set.
- Set the character feed speed.
- Set the time until the window automatically closes.

## インストール  Install

### 方法1  Method 1

FVTTの「モッド・拡張機能」の「モジュールを入手」ウィンドウで、「Simple Message Window」を検索してインストールしてください。

In 'Install Module' window of Foundry VTT's 'Add-on Modules', search for 'Simple Message Window' and install it.

### 方法2  Method 2

ManifestURL: https://github.com/jeannjeann/simple-message-window-fvtt/releases/latest/download/module.json

FVTTの「モッド・拡張機能」の「モジュールを入手」ウィンドウで、「URLを指定」の欄に上記の「ManifestURL」をペーストしてインストールしてください。

In 'Install Module' window of Foundry VTT's 'Add-on Modules', paste the above 'ManifestURL' into the 'Manifest URL' field and install it.

# CHANGELOG

## 2.0.1
- bug fix

## 2.0.0
- v13 supported (Requires v13 or later)

## 1.2.5
- bug fix

## 1.2.4
- v12 supported

## 1.2.3
- fix to correctly display images of unlinked tokens
- bug fix

## 1.2.2
- add setting for display other message
- bug fix

## 1.2.1
- fix display of complex messages
- bug fix

## 1.2.0
- add setting for timeout to hide the message window
- bug fix

## 1.1.1
- bug fix (Show roll bug)

## 1.1.0
- support "Polyglot" module
- add setting for horizontal position of message window
- add setting for transparency of window background and image
- bug fix

## 1.0.1
- add hide default image (mystery-man.svg) option

## 1.0.0
- first release