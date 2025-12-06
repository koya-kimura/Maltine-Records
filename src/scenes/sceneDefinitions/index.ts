// Scene Definitions Index - すべてのシーンをここで登録
import { sceneManager } from "../SceneManager";
import { noscene } from "./noscene";
import { scene01 } from "./scene01";
import { scene02 } from "./scene02";
import { scene03 } from "./scene03";
import { scene04 } from "./scene04";
import { scene05 } from "./scene05";
import { scene06 } from "./scene06";
import { scene07 } from "./scene07";
import { scene08 } from "./scene08";
import { scene09 } from "./scene09";
import { scene10 } from "./scene10";
import { scene11 } from "./scene11";
import { scene12 } from "./scene12";
import { scene13 } from "./scene13";
import { scene14 } from "./scene14";
import { scene15 } from "./scene15";
import { scene16 } from "./scene16";
import { scene17 } from "./scene17";
import { scene18 } from "./scene18";
import { scene19 } from "./scene19";
import { scene20 } from "./scene20";
import { scene21 } from "./scene21";
import { scene22 } from "./scene22";
import { scene23 } from "./scene23";

// シーンを順番に登録（この順番がボタンの順番になる）

sceneManager.register(scene01);
sceneManager.register(scene02);
sceneManager.register(scene03);
sceneManager.register(scene04);

//======

sceneManager.register(scene05);
sceneManager.register(scene06);
sceneManager.register(scene07);
sceneManager.register(scene08);

//======

sceneManager.register(scene09);
sceneManager.register(scene10);
sceneManager.register(scene11);
sceneManager.register(scene12);

//======

sceneManager.register(scene13);
sceneManager.register(scene14);
sceneManager.register(scene15);
sceneManager.register(scene16);

//======

sceneManager.register(scene17);
sceneManager.register(scene18);
sceneManager.register(scene19);
sceneManager.register(scene20);

//======

sceneManager.register(scene21);
sceneManager.register(scene22);
sceneManager.register(scene23);
sceneManager.register(noscene);

//======

sceneManager.register(noscene);
sceneManager.register(noscene);
sceneManager.register(noscene);
sceneManager.register(noscene);

// シーンの総数をエクスポート
export const SCENE_COUNT = sceneManager.getSceneCount();
