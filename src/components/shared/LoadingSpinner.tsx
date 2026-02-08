interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({
    message = "Loading...",
    size = "md",
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div
                className={`animate-spin ${sizeClasses[size]} border-primary border-t-transparent rounded-full mr-3`}
            />
            <span className="text-gray-600">{message}</span>
        </div>
    );
};
