import React, { useState, useEffect } from 'react';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    EyeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

const Chatbots = () => {
    const { user } = useAuth();
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingChatbot, setEditingChatbot] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        company_name: '',
        provider: 'openai',
        model: '',
        endpoint_url: '',
        api_key: '',
        monitoring_enabled: true,
        risk_threshold: 70,
        alert_on_risk: true
    });
    const [filters, setFilters] = useState({
        status: '',
        provider: '',
        company_name: '',
        monitoring_enabled: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        page_size: 50,
        total_count: 0
    });

    useEffect(() => {
        loadChatbots();
    }, [filters, pagination.page]);

    const loadChatbots = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/chatbots', {
                params: {
                    ...filters,
                    page: pagination.page,
                    page_size: pagination.page_size
                }
            });
            setChatbots(response.items || []);
            setPagination(prev => ({
                ...prev,
                total_count: response.total_count || 0
            }));
        } catch (error) {
            console.error('Failed to load chatbots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingChatbot) {
                await apiService.put(`/chatbots/${editingChatbot.id}`, formData);
            } else {
                await apiService.post('/chatbots', formData);
            }
            setShowModal(false);
            setEditingChatbot(null);
            resetForm();
            loadChatbots();
        } catch (error) {
            console.error('Failed to save chatbot:', error);
        }
    };

    const handleEdit = (chatbot) => {
        setEditingChatbot(chatbot);
        setFormData({
            name: chatbot.name,
            description: chatbot.description || '',
            company_name: chatbot.company_name,
            provider: chatbot.provider,
            model: chatbot.model,
            endpoint_url: chatbot.endpoint_url || '',
            api_key: '',
            monitoring_enabled: chatbot.monitoring_enabled,
            risk_threshold: chatbot.risk_threshold,
            alert_on_risk: chatbot.alert_on_risk
        });
        setShowModal(true);
    };

    const handleDelete = async (chatbotId) => {
        if (window.confirm('Are you sure you want to delete this chatbot?')) {
            try {
                await apiService.delete(`/chatbots/${chatbotId}`);
                loadChatbots();
            } catch (error) {
                console.error('Failed to delete chatbot:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            company_name: '',
            provider: 'openai',
            model: '',
            endpoint_url: '',
            api_key: '',
            monitoring_enabled: true,
            risk_threshold: 70,
            alert_on_risk: true
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'inactive':
                return <XCircleIcon className="h-5 w-5 text-gray-500" />;
            case 'suspended':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            case 'monitoring':
                return <ShieldCheckIcon className="h-5 w-5 text-blue-500" />;
            default:
                return <XCircleIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getProviderColor = (provider) => {
        const colors = {
            openai: 'bg-blue-100 text-blue-800',
            anthropic: 'bg-purple-100 text-purple-800',
            google: 'bg-green-100 text-green-800',
            meta: 'bg-indigo-100 text-indigo-800',
            custom: 'bg-gray-100 text-gray-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[provider] || colors.other;
    };

    const totalPages = Math.ceil(pagination.total_count / pagination.page_size);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Chatbot Management</h1>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Chatbot
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="monitoring">Monitoring</option>
                    </select>
                    <select
                        value={filters.provider}
                        onChange={(e) => setFilters(prev => ({ ...prev, provider: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">All Providers</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="google">Google</option>
                        <option value="meta">Meta</option>
                        <option value="custom">Custom</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={filters.company_name}
                        onChange={(e) => setFilters(prev => ({ ...prev, company_name: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <select
                        value={filters.monitoring_enabled}
                        onChange={(e) => setFilters(prev => ({ ...prev, monitoring_enabled: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">All Monitoring</option>
                        <option value="true">Monitoring Enabled</option>
                        <option value="false">Monitoring Disabled</option>
                    </select>
                    <button
                        onClick={() => setFilters({
                            status: '',
                            provider: '',
                            company_name: '',
                            monitoring_enabled: '',
                            search: ''
                        })}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Chatbots Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading chatbots...</p>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chatbot
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Provider
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monitoring
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Conversations
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {chatbots.map((chatbot) => (
                                    <tr key={chatbot.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {chatbot.name}
                                                </div>
                                                {chatbot.description && (
                                                    <div className="text-sm text-gray-500">
                                                        {chatbot.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {chatbot.company_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProviderColor(chatbot.provider)}`}>
                                                {chatbot.provider}
                                            </span>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {chatbot.model}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(chatbot.status)}
                                                <span className="text-sm text-gray-900 capitalize">
                                                    {chatbot.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {chatbot.monitoring_enabled ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircleIcon className="h-5 w-5 text-red-500" />
                                                )}
                                                <span className="text-sm text-gray-900">
                                                    {chatbot.monitoring_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <div>Total: {chatbot.total_conversations}</div>
                                                {chatbot.flagged_conversations > 0 && (
                                                    <div className="text-red-600">
                                                        Flagged: {chatbot.flagged_conversations}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(chatbot)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(chatbot.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">
                                                {((pagination.page - 1) * pagination.page_size) + 1}
                                            </span>{' '}
                                            to{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.page * pagination.page_size, pagination.total_count)}
                                            </span>{' '}
                                            of{' '}
                                            <span className="font-medium">{pagination.total_count}</span>{' '}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === pagination.page
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingChatbot ? 'Edit Chatbot' : 'Add New Chatbot'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        rows="2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Provider</label>
                                        <select
                                            required
                                            value={formData.provider}
                                            onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="openai">OpenAI</option>
                                            <option value="anthropic">Anthropic</option>
                                            <option value="google">Google</option>
                                            <option value="meta">Meta</option>
                                            <option value="custom">Custom</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Model</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.model}
                                            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Endpoint URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={formData.endpoint_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endpoint_url: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                {!editingChatbot && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">API Key</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.api_key}
                                            onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Risk Threshold</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.risk_threshold}
                                            onChange={(e) => setFormData(prev => ({ ...prev, risk_threshold: parseInt(e.target.value) }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.monitoring_enabled}
                                                onChange={(e) => setFormData(prev => ({ ...prev, monitoring_enabled: e.target.checked }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Monitoring</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.alert_on_risk}
                                                onChange={(e) => setFormData(prev => ({ ...prev, alert_on_risk: e.target.checked }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Alerts</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingChatbot(null);
                                            resetForm();
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                    >
                                        {editingChatbot ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbots;