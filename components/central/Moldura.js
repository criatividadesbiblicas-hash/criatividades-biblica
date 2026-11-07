// components/central/Moldura.js
import Menu from "./Menu";
import { rotuloRodada } from "./formato";

export default function Moldura({ ativa, contadores, rodada, children }) {
  return (
    <div className="c-app">
      <Menu ativa={ativa} contadores={contadores} rotulo={rotuloRodada(rodada)} />
      <main className="c-principal">{children}</main>
    </div>
  );
}
