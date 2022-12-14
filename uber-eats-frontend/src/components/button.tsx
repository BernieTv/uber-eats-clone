interface IButtonProps {
	canClick: boolean;
	loading: boolean;
	actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
	return (
		<button
			disabled={!canClick}
			className={`py-4 text-lg font-medium focus:outline-none text-white transition-colors ${
				canClick
					? 'bg-lime-600 hover:bg-lime-700 '
					: 'bg-gray-300 pointer-events-none'
			}`}>
			{loading ? 'Loading...' : actionText}
		</button>
	);
};
