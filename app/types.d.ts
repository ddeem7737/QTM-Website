declare module "@svg-maps/world" {
  const map: {
    label: string;
    viewBox: string;
    locations: Array<{ name: string; id: string; path: string }>;
  };
  export default map;
}
