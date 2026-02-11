import { Info } from 'lucide-react';

export default function Widgets() {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sticky top-20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-sm text-gray-900">LinkedIn News</h2>
                <Info className="h-4 w-4 text-gray-500" />
            </div>

            <ul className="space-y-4">
                <NewsItem title="Tech hiring stabilizes" time="10h ago" readers="12,093" />
                <NewsItem title="AI regulation talks heat up" time="1d ago" readers="8,442" />
                <NewsItem title="Remote work trends 2024" time="2d ago" readers="45,211" />
                <NewsItem title="New startups to watch" time="3d ago" readers="6,120" />
                <NewsItem title="JavaScript frameworks ranked" time="4d ago" readers="19,833" />
            </ul>

            <button className="flex items-center text-sm font-semibold text-gray-500 mt-4 hover:bg-gray-100 px-2 py-1 rounded">
                Show more
            </button>

        </div>
    );
}

function NewsItem({ title, time, readers }) {
    return (
        <li className="cursor-pointer hover:bg-gray-50 p-1 rounded">
            <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 bg-gray-500 rounded-full flex-shrink-0"></span>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{title}</h3>
                    <p className="text-xs text-gray-500">{time} • {readers} readers</p>
                </div>
            </div>
        </li>
    );
}
