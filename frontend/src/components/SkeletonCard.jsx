import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-cardBg border border-borderColor p-5 rounded-xl animate-pulse">

            {/* Header: Icon + Name */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5"></div>
                    <div>
                        <div className="h-4 w-24 bg-white/5 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-white/5 rounded"></div>
                    </div>
                </div>
                <div className="w-16 h-6 bg-white/5 rounded-full"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-bgMain p-2 rounded border border-borderColor h-12"></div>
                <div className="bg-bgMain p-2 rounded border border-borderColor h-12"></div>
            </div>

            {/* Footer */}
            <div className="h-3 w-32 bg-white/5 rounded mt-2"></div>
        </div>
    );
};

export default SkeletonCard;
