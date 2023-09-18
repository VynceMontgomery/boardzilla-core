type GameElement = {
  isGameElement: true;
  name: string
}

type Player = {
  isPlayer: true;
}

type Space = GameElement & {
  isSpace: true;
}

type ElementContext = {
  top: GameElement;
  removed: GameElement;
  sequence: number;
  named: Record<string, GameElement>;
  player?: Player;
  classRegistry: ElementClass<GameElement>[];
} & Record<string, any>;

type ElementClass<T extends GameElement> = {
  new(ctx: Partial<ElementContext>): T;
  isGameElement: true;
} & Record<any, any>

type ElementAttributes<T extends GameElement> =
  Partial<Pick<T, {[K in keyof T]: K extends keyof GameElement ? never : (T[K] extends (...a:any[]) => any ? never : K)}[keyof T] | 'name'>>


type ElementFinder<T extends GameElement> = (
  ((e: T) => boolean) |
    (ElementAttributes<T> & {mine?: boolean, adjacent?: boolean, withinDistance?: number}) |
    string
);

type b = Pick<GameElement, never | 'isGameElement'>
const bb:b = () => {}
  
const aa:ElementAttributes<GameElement> = {p:'a', name: 'a'};

type a = Partial<{a:1, c:3}> & {b?:2, d:4}

const ab:a = {d:4};

class Piece implements GameElement {
  isGameElement: true;
  name = 'piece';
  pp: string;
  a() {
    const f:ElementAttributes<Piece> = {pp: 'a', name:'a'};
  }
}
const p = new Piece();
const f:ElementFinder<typeof p> = {adjacent: true};
