export {};

declare module "meshline" {
  export const MeshLineGeometry: new () => unknown;
  export const MeshLineMaterial: new (params?: unknown) => unknown;
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        meshLineGeometry: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        > & { attach?: string };
        meshLineMaterial: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        > & {
          color?: string;
          depthTest?: boolean;
          resolution?: [number, number];
          useMap?: boolean;
          map?: unknown;
          repeat?: [number, number];
          lineWidth?: number;
        };
      }
    }
  }
}
