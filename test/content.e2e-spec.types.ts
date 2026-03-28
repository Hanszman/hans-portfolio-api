export type LoginEndpointResponse = {
  accessToken: string;
};

export type TagRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  type: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
