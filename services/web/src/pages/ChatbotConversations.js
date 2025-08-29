import React, { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

const ChatbotConversations = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filters, setFilters] = useState({
        chatbot_id: '',
        flagged: '',
        min_risk_score: '',
        max_risk_score: '',
        start_date: '',
        end_date: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        page_size: 50,
        total_count: 0
    });

    useEffect(() => {
        loadChatbots();
        loadConversations();
    }, [filters, pagination.page]);

    const loadChatbots = async () => {
        try {
            const response = await apiService.get('/chatbots', {
                params: { page_size: 1000 }
            });
            setChatbots(response.items || []);
        } catch (error) {
            console.error('Failed to load chatbots:', error);
        }
    };

    const loadConversations = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/chatbots/conversations', {
                params: {
                    ...filters,
                    page: pagination.page,
                    page_size: pagination.page_size
                }
            });
            setConversations(response.items || []);
            setPagination(prev => ({
                ...prev,
                total_count: response.total_count || 0
            }));
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (conversation) => {
        setSelectedConversation(conversation);
        setShowDetailModal(true);
    };

    const getRiskColor = (riskScore) => {
        if (riskScore >= 90) return 'text-red-600 bg-red-100';
        if (riskScore >= 70) return 'text-orange-600 bg-orange-100';
        if (riskScore >= 50) return 'text-yellow-600 bg-yellow-100';
        if (riskScore >= 25) return 'text-blue-600 bg-blue-100';
        return 'text-green-600 bg-green-100';
    };

    const getRiskLevel = (riskScore) => {
        if (riskScore >= 90) return 'Critical';
        if (riskScore >= 70) return 'High';
        if (riskScore >= 50) return 'Medium';
        if (riskScore >= 25) return 'Low';
        return 'Minimal';
    };

    const getChatbotName = (chatbotId) => {
        const chatbot = chatbots.find(c => c.id === chatbotId);
        return chatbot ? chatbot.name : 'Unknown';
    };

    const getCompanyName = (chatbotId) => {
        const chatbot = chatbots.find(c => c.id === chatbotId);
        return chatbot ? chatbot.company_name : 'Unknown';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const totalPages = Math.ceil(pagination.total_count / pagination.page_size);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Chatbot Conversations</h1>
                <p className="text-gray-600 mt-2">
                    Monitor chatbot conversations for problematic responses and security risks
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                        value={filters.chatbot_id}
                        onChange={(e) => setFilters(prev => ({ ...prev, chatbot_id: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">All Chatbots</option>
                        {chatbots.map(chatbot => (
                            <option key={chatbot.id} value={chatbot.id}>
                                {chatbot.name} - {chatbot.company_name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.flagged}
                        onChange={(e) => setFilters(prev => ({ ...prev, flagged: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">All Conversations</option>
                        <option value="true">Flagged Only</option>
                        <option value="false">Not Flagged</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Min Risk Score"
                        value={filters.min_risk_score}
                        onChange={(e) => setFilters(prev => ({ ...prev, min_risk_score: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        max="100"
                    />
                    <input
                        type="number"
                        placeholder="Max Risk Score"
                        value={filters.max_risk_score}
                        onChange={(e) => setFilters(prev => ({ ...prev, max_risk_score: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        max="100"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search in prompts/responses..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                        />
                        <button
                            onClick={() => setFilters({
                                chatbot_id: '',
                                flagged: '',
                                min_risk_score: '',
                                max_risk_score: '',
                                start_date: '',
                                end_date: '',
                                search: ''
                            })}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Conversations Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading conversations...</p>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chatbot & Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Conversation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Risk Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {conversations.map((conversation) => (
                                    <tr key={conversation.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getChatbotName(conversation.chatbot_id)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {getCompanyName(conversation.chatbot_id)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm text-gray-900 mb-1">
                                                    <strong>Prompt:</strong> {conversation.prompt.substring(0, 100)}
                                                    {conversation.prompt.length > 100 && '...'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <strong>Response:</strong> {conversation.response.substring(0, 100)}
                                                    {conversation.response.length > 100 && '...'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(conversation.risk_score)}`}>
                                                    {conversation.risk_score}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {getRiskLevel(conversation.risk_score)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {conversation.is_flagged ? (
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                                ) : (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                )}
                                                <span className={`text-sm ${conversation.is_flagged ? 'text-red-600' : 'text-green-600'}`}>
                                                    {conversation.is_flagged ? 'Flagged' : 'Safe'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(conversation.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetail(conversation)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                View
                                            </button>
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

            {/* Conversation Detail Modal */}
            {showDetailModal && selectedConversation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Conversation Details
                                </h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Conversation Info */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Conversation Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium">Chatbot:</span> {getChatbotName(selectedConversation.chatbot_id)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Company:</span> {getCompanyName(selectedConversation.chatbot_id)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Conversation ID:</span> {selectedConversation.conversation_id}
                                            </div>
                                            {selectedConversation.user_id && (
                                                <div>
                                                    <span className="font-medium">User ID:</span> {selectedConversation.user_id}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Timestamp:</span> {formatDate(selectedConversation.timestamp)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Risk Score:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(selectedConversation.risk_score)}`}>
                                                    {selectedConversation.risk_score} - {getRiskLevel(selectedConversation.risk_score)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Status:</span>
                                                <span className={`flex items-center gap-1 ${selectedConversation.is_flagged ? 'text-red-600' : 'text-green-600'}`}>
                                                    {selectedConversation.is_flagged ? (
                                                        <ExclamationTriangleIcon className="h-4 w-4" />
                                                    ) : (
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    )}
                                                    {selectedConversation.is_flagged ? 'Flagged' : 'Safe'}
                                                </span>
                                            </div>
                                            {selectedConversation.flag_reason && (
                                                <div>
                                                    <span className="font-medium">Flag Reason:</span> {selectedConversation.flag_reason}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedConversation.metadata && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                                            <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                                                {JSON.stringify(selectedConversation.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Content */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">User Prompt</h4>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                {selectedConversation.prompt}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Chatbot Response</h4>
                                        <div className={`p-4 rounded-lg border ${
                                            selectedConversation.is_flagged 
                                                ? 'bg-red-50 border-red-200' 
                                                : 'bg-green-50 border-green-200'
                                        }`}>
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                {selectedConversation.response}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotConversations;