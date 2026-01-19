import React, { useState } from 'react';
import { Form, Input, Select, Radio, Upload, Button, message, Space, Divider, Alert, Badge } from 'antd';
import { MessageOutlined, AlignLeftOutlined, CloudUploadOutlined, AudioOutlined, FileTextOutlined, ThunderboltOutlined, RobotOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
import { useApiUrl } from '@refinedev/core';
import type { UploadFile } from 'antd/es/upload/interface';

interface InteractionModalProps {
    modalProps: any;
    formProps: any;
    initialValues?: any;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({ modalProps, formProps, initialValues, }) => {
    const apiUrl = useApiUrl();
    const [inputMode, setInputMode] = useState<'manual' | 'audio'>('manual');
    const [audioFile, setAudioFile] = useState<UploadFile | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');

    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleAudioUpload = (file: UploadFile) => {
        
        const actualFile = (file as any).originFileObj || file;
        
        const isAudio = file.type?.startsWith('audio/') || 
                        file.name?.endsWith('.mp3') || 
                        file.name?.endsWith('.m4a') || 
                        file.name?.endsWith('.wav') ||
                        file.name?.endsWith('.ogg') ||
                        file.name?.endsWith('.webm');
        
        if (!isAudio) {
            message.error('Vui lòng chỉ tải lên file audio (mp3, m4a, wav, ogg, webm)!');
            return false;
        }

        const isLt25M = (file.size || 0) / 1024 / 1024 < 25;
        if (!isLt25M) {
            message.error('File audio phải nhỏ hơn 25MB!');
            return false;
        }

        const fileWithOrigin = {
            uid: file.uid || Date.now().toString(),
            name: file.name || 'audio-file',
            status: 'done' as const,
            size: file.size,
            type: file.type,
            originFileObj: actualFile instanceof File ? actualFile : file.originFileObj || actualFile
        };
        
        setAudioFile(fileWithOrigin);
        return false; 
    };

    const handleTranscribe = async () => {
        if (!audioFile) {
            message.warning('Vui lòng chọn file audio trước!');
            return;
        }

        const actualFile = (audioFile as any).originFileObj || (audioFile as any).file || audioFile;
        
        if (!actualFile) {
            message.error('File audio không hợp lệ! Vui lòng chọn lại file.');
            return;
        }

        if (!(actualFile instanceof File) && !(actualFile instanceof Blob)) {
            message.error('File audio không đúng định dạng! Vui lòng chọn lại file.');
            return;
        }

        setIsTranscribing(true);
        
        try {
            const formData = new FormData();
            formData.append('audioFile', actualFile as Blob);

            const response = await fetch(`${apiUrl}/interactions/transcribe-audio`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                
                setTranscript(result.data.transcript || '');

                formProps.form?.setFieldsValue({ 
                    transcript: result.data.transcript || ''
                });
                
                message.success('Chuyển đổi file audio thành văn bản thành công!');
            } else {
                throw new Error(result.message || 'Lỗi khi chuyển đổi audio');
            }
            
        } catch (error: any) {
            
            message.error(error.message || 'Có lỗi xảy ra khi chuyển đổi file audio!');
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleSummarize = async () => {
        if (!transcript || transcript.trim().length === 0) {
            message.warning('Chưa có nội dung để tóm tắt! Vui lòng chuyển đổi audio trước.');
            return;
        }

        setIsSummarizing(true);
        
        try {
            const response = await fetch(`${apiUrl}/interactions/summarize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ transcript }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                const summaryText = result.data.summary || '';
                setSummary(summaryText);

                formProps.form?.setFieldsValue({ detail: summaryText });
                
                message.success('Tạo tóm tắt thành công!');
            } else {
                throw new Error(result.message || 'Lỗi khi tóm tắt');
            }
            
        } catch (error: any) {
            
            message.error(error.message || 'Có lỗi xảy ra khi tóm tắt!');
        } finally {
            setIsSummarizing(false);
        }
    };

    React.useEffect(() => {
        if (!modalProps.open) {
            setInputMode('manual');
            setAudioFile(null);
            setTranscript('');
            setSummary('');
        }
    }, [modalProps.open]);

    return (
        <ProfessionalModal 
            {...modalProps} 
            okText="Lưu" 
            cancelText="Hủy" 
            title="Thêm tương tác" 
            icon={<MessageOutlined className="text-blue-600"/>} 
            width={1300} 
            destroyOnClose
        >
            <Form {...formProps} layout="vertical" className="space-y-4" initialValues={initialValues}>
                
                <Form.Item name="userId" hidden>
                    <Input />
                </Form.Item>

                <ProfessionalFormItem 
                    label="Loại tương tác" 
                    name="interactionType" 
                    icon={<MessageOutlined className="text-blue-500"/>} 
                    rules={[{ required: true, message: "Vui lòng chọn loại tương tác" }]}
                >
                    <Select
                        placeholder="Chọn loại tương tác"
                        options={[
                            { label: 'Nhắn tin', value: 'Nhắn tin' },
                            { label: 'Gọi điện', value: 'Gọi điện' },
                            { label: 'Gặp mặt', value: 'Gặp mặt' },
                        ]}
                    />
                </ProfessionalFormItem>

                <Divider style={{ margin: '12px 0' }} />

                {}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                        Cách nhập tương tác:
                    </div>
                    <Radio.Group 
                        value={inputMode} 
                        onChange={(e) => setInputMode(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Radio value="manual">
                                <Space>
                                    Nhập thủ công
                                </Space>
                            </Radio>
                            <Radio value="audio">
                                <Space>
                                    Tải lên audio + tự động tóm tắt
                                </Space>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>

                {}
                {inputMode === 'audio' && (
                    <div style={{ 
                        background: '#f0f9ff', 
                        padding: 20, 
                        borderRadius: 12,
                        border: '2px dashed #3b82f6'
                    }}>
                        <Alert
                            message="Tải lên file ghi âm cuộc gọi, tự động chuyển thành văn bản và tóm tắt nội dung"
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <Upload.Dragger
                            accept="audio/*"
                            beforeUpload={handleAudioUpload}
                            fileList={audioFile ? [audioFile] : []}
                            onRemove={() => {
                                setAudioFile(null);
                                return true;
                            }}
                            maxCount={1}
                        >
                            <p className="ant-upload-drag-icon">
                                <CloudUploadOutlined style={{ fontSize: 48, color: '#3b82f6' }} />
                            </p>
                            <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 500 }}>
                                Nhấp hoặc kéo thả file audio vào đây
                            </p>
                            <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
                                Hỗ trợ: MP3, M4A, WAV, OGG, WEBM (tối đa 25MB)
                            </p>
                        </Upload.Dragger>

                        {audioFile && (
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    type="primary"
                                    icon={<AudioOutlined />}
                                    onClick={handleTranscribe}
                                    loading={isTranscribing}
                                    block
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        height: 44,
                                        fontWeight: 600
                                    }}
                                >
                                    {isTranscribing ? 'Đang chuyển đổi file audio...' : 'Chuyển đổi file audio thành văn bản'}
                                </Button>
                            </div>
                        )}

                        {transcript && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: 8 
                                }}>
                                    <div style={{ fontWeight: 500, color: '#374151' }}>
                                        Nội dung phiên âm:
                                    </div>
                                </div>
                                <Input.TextArea
                                    value={transcript}
                                    onChange={(e) => {
                                        setTranscript(e.target.value);
                                        
                                        formProps.form?.setFieldsValue({ transcript: e.target.value });
                                    }}
                                    rows={12}
                                    
                                    placeholder="Nội dung phiên âm sẽ hiển thị ở đây..."
                                    style={{ 
                                        marginBottom: 12,
                                        background: 'white',
                                        border: '1px solid #e5e7eb'
                                    }}
                                />

                                <Button
                                    type="default"
                                    onClick={handleSummarize}
                                    loading={isSummarizing}
                                    block
                                    size="large"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        border: 'none',
                                        height: 44,
                                        fontWeight: 600,
                                        marginTop: 12
                                    }}
                                >
                                    {isSummarizing ? 'Đang tạo tóm tắt...' : 'Tạo tóm tắt từ nội dung trên'}
                                </Button>

                                {summary && (
                                    <Alert
                                        message="Tóm tắt đã được tạo và điền vào ô chi tiết tương tác bên dưới, bạn có thể chỉnh sửa nếu cần."
                                        type="success"
                                        showIcon
                                        style={{ marginTop: 12, marginBottom: 12 }}
                                    />
                                )}
                            </div>
                        )}

                        {}
                        <Form.Item name="transcript" hidden>
                            <Input />
                        </Form.Item>
                    </div>
                )}
                <Divider style={{ margin: '12px 0' }} />

                <ProfessionalFormItem 
                    label="Chi tiết tương tác" 
                    name="detail" 
                    icon={<AlignLeftOutlined className="text-purple-500"/>}
                    rules={[{ required: true, message: "Vui lòng nhập chi tiết tương tác" }]}
                >
                    <Input.TextArea 
                        rows={inputMode === 'audio' ? 6 : 4} 
                        placeholder={inputMode === 'audio' 
                            ? "Bản tóm tắt sẽ tự động điền vào đây, bạn có thể chỉnh sửa nếu cần." 
                            : "Nhập chi tiết tương tác"
                        }
                        showCount 
                        maxLength={2000}
                    />
                </ProfessionalFormItem>
                
                <Form.Item name="leadId" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </ProfessionalModal>
    );
};