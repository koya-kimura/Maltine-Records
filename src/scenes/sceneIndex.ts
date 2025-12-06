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
import { FaceGrid } from "./sceneDefinitions/FaceGrid";
import { CarMoving } from "./sceneDefinitions/carMoving";

import { EmptyScene } from "./sceneDefinitions/EmptyScene";

// シーンを順番に登録（この順番がボタンの順番になる）

sceneManager.register(CatchyFaceFront);    // 元1
sceneManager.register(NofaceBottom);       // 元12
sceneManager.register(RandomImage);        // 元24
sceneManager.register(FaceGrid);          // 元25

//======

sceneManager.register(AnimalMarching);     // 元2
sceneManager.register(AnimalSwing);        // 元3
sceneManager.register(AnimalMirrored);     // 元4
sceneManager.register(EmptyScene);         // x

//======

sceneManager.register(HumanBottom);        // 元6
sceneManager.register(HumanRotated);       // 元7
sceneManager.register(HumanZigzag);        // 元8
sceneManager.register(HumanRising);        // 元10

//======

sceneManager.register(LifeOrbit);          // 元14
sceneManager.register(LifeFalling);        // 元15
sceneManager.register(LifeGather);         // 元17
sceneManager.register(LifeRotate);         // 元18

//======

sceneManager.register(DothandSpin);        // 元13
sceneManager.register(AnimationRadial);    // 元21
sceneManager.register(HumanWithHand);      // 元5
sceneManager.register(EmptyScene);         // x

//======

sceneManager.register(WalkTriple);         // 元9
sceneManager.register(WalkCircle);         // 元16
sceneManager.register(RandomAnimation);    // 元23
sceneManager.register(CarMoving);         // 新規追加

//======

sceneManager.register(DanceRandom);        // 元11
sceneManager.register(DanceBig);           // 元19
sceneManager.register(StepCenter);         // 元20
sceneManager.register(EmptyScene);         // x

//======

sceneManager.register(HandRotate);         // 元22
sceneManager.register(EmptyScene);         // x
sceneManager.register(EmptyScene);         // x
// 最後のボタンはランダムに割当たってる

// シーンの総数をエクスポート
export const SCENE_COUNT = sceneManager.getSceneCount();
