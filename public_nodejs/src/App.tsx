import "./styles.css";
import { TooltipProvider } from "@bluevoid-test/ui/tooltip";
import { cn } from "@bluevoid-test/ui/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import Header from "./_components/Header";
import WskaznikiPage from "./page";
import queryClient from "./utils/queryClient";

function App() {
	return (
		<TooltipProvider>
			<Header />
			<main
				className={cn(
					"min-h-screen pt-14 transition-all",
					// !isMobile && "pl-[5.5rem]",
				)}
			>
				<QueryClientProvider client={queryClient}>
					<WskaznikiPage />
				</QueryClientProvider>
			</main>
		</TooltipProvider>
	);
}

export default App;
