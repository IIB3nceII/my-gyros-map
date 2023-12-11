// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Marker = Partial<L.Marker<any>> & {
  id: string;
  title: string;
  rating: number;
  description: string;
  latlng: [number, number];
};

export default Marker;
