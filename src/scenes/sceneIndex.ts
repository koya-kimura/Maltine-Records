// Scene Definitions Index - すべてのシーンをここで登録
import { sceneManager } from "./SceneManager";

// シーン定義のインポート
import { CatchyFaceFront } from "./sceneDefinitions/CatchyFaceFront";
import { AnimalMarching } from "./sceneDefinitions/AnimalMarching";
import { AnimalSwing } from "./sceneDefinitions/AnimalSwing";
import { AnimalMirrored } from "./sceneDefinitions/AnimalMirrored";

import { HumanWithHand } from "./sceneDefinitions/HumanWithHand";
import { HumanBottom } from "./sceneDefinitions/HumanBottom";
import { HumanRotated } from "./sceneDefinitions/HumanRotated";
import { HumanZigzag } from "./sceneDefinitions/HumanZigzag";

import { WalkTriple } from "./sceneDefinitions/WalkTriple";
import { HumanRising } from "./sceneDefinitions/HumanRising";
import { DanceRandom } from "./sceneDefinitions/DanceRandom";
import { NofaceBottom } from "./sceneDefinitions/NofaceBottom";

import { DothandSpin } from "./sceneDefinitions/DothandSpin";
import { LifeOrbit } from "./sceneDefinitions/LifeOrbit";
import { LifeFalling } from "./sceneDefinitions/LifeFalling";
import { WalkCircle } from "./sceneDefinitions/WalkCircle";

import { LifeGather } from "./sceneDefinitions/LifeGather";
import { LifeRotate } from "./sceneDefinitions/LifeRotate";
import { DanceBig } from "./sceneDefinitions/DanceBig";
import { StepCenter } from "./sceneDefinitions/StepCenter";

import { AnimationRadial } from "./sceneDefinitions/AnimationRadial";
import { HandRotate } from "./sceneDefinitions/HandRotate";
import { RandomAnimation } from "./sceneDefinitions/RandomAnimation";
import { RandomImage } from "./sceneDefinitions/RandomImage";

import { EmptyScene } from "./sceneDefinitions/EmptyScene";

// シーンを順番に登録（この順番がボタンの順番になる）

sceneManager.register(CatchyFaceFront);
sceneManager.register(AnimalMarching);
sceneManager.register(AnimalSwing);
sceneManager.register(AnimalMirrored);

//======

sceneManager.register(HumanWithHand);
sceneManager.register(HumanBottom);
sceneManager.register(HumanRotated);
sceneManager.register(HumanZigzag);

//======

sceneManager.register(WalkTriple);
sceneManager.register(HumanRising);
sceneManager.register(DanceRandom);
sceneManager.register(NofaceBottom);

//======

sceneManager.register(DothandSpin);
sceneManager.register(LifeOrbit);
sceneManager.register(LifeFalling);
sceneManager.register(WalkCircle);

//======

sceneManager.register(LifeGather);
sceneManager.register(LifeRotate);
sceneManager.register(DanceBig);
sceneManager.register(StepCenter);

//======

sceneManager.register(AnimationRadial);
sceneManager.register(HandRotate);
sceneManager.register(RandomAnimation);
sceneManager.register(RandomImage);

//======

sceneManager.register(EmptyScene);
sceneManager.register(EmptyScene);
sceneManager.register(EmptyScene);
sceneManager.register(EmptyScene);

//======

sceneManager.register(EmptyScene);
sceneManager.register(EmptyScene);
sceneManager.register(EmptyScene);
// 最後のボタンはランダムに割当たってる

// シーンの総数をエクスポート
export const SCENE_COUNT = sceneManager.getSceneCount();
