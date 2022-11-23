import Footer from "../components/Footer";
import Header from "../components/Header/Header";

export default function Loading(props: { index?: boolean, login?: boolean, about?: boolean, account?: boolean }) {

  return (
    <div className="flex flex-col min-h-screen">
      <Header index={props.index} login={props.login} about={props.about} account={props.account} />

      <main className="max-w-5xl mx-auto flex-1 flex items-center gap-2 my-8">
        <div className="flex rounded-full animate-spin w-24 h-24 border-4 border-black/40 border-t-button-base" />
      </main>

      <Footer />
    </div>
  );
}