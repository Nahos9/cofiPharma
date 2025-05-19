export function Card({ className = '', children }) {
    return (
        <div className={`bg-white overflow-hidden w-full shadow-lg rounded-lg ${className}`}>
            {children}
        </div>
    );
}