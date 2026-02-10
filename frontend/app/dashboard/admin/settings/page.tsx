export default function AdminSettingsPage() {
    return (
        <div className="bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h1>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                        <div className="font-bold">Maintenance Mode</div>
                        <div className="text-sm text-gray-500">Disable system access for non-admins</div>
                    </div>
                    <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded">Disabled</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                        <div className="font-bold">Registration</div>
                        <div className="text-sm text-gray-500">Allow new users to register</div>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">Enabled</button>
                </div>
            </div>
        </div>
    );
}
