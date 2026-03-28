import type { Type } from '@nestjs/common';
import type { ContentResourceKey } from '../types/content.types';

export type PublicControllerCase<TController> = {
  label: string;
  resource: ContentResourceKey;
  controller: Type<TController>;
  lookupValue: string;
  invokeList(
    this: void,
    controller: TController,
    query: object,
  ): Promise<unknown>;
  invokeDetail(
    this: void,
    controller: TController,
    lookupValue: string,
  ): Promise<unknown>;
};

export type AdminControllerCase<TController> = {
  label: string;
  resource: ContentResourceKey;
  controller: Type<TController>;
  id: string;
  createBody: object;
  updateBody: object;
  invokeCreate(
    this: void,
    controller: TController,
    body: object,
  ): Promise<unknown>;
  invokeUpdate(
    this: void,
    controller: TController,
    id: string,
    body: object,
  ): Promise<unknown>;
  invokeDelete(
    this: void,
    controller: TController,
    id: string,
  ): Promise<unknown>;
};
