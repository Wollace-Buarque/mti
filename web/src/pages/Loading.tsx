import Footer from "../components/Footer";
import Header from "../components/Header/Header";

export default function Loading(props: { index?: boolean, login?: boolean, about?: boolean, account?: boolean }) {

  return (
    <div className="flex flex-col min-h-screen">
      <Header index={props.index} signin={props.login} about={props.about} account={props.account} />

      <main className="max-w-5xl flex-1 flex my-8 mx-auto">

        <div className="loader">
          <svg className="animate-spin-slow w-full h-full inset-0 absolute origin-center" viewBox="25 25 50 50">
            <circle className="path stroke-button-base"
              cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
          </svg>
        </div>

      </main>

      <Footer />
    </div>
  );
}