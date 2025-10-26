"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryPopup from './CategoryPopup'; 

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🍽️');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState('สารสาธารณูปโภค');
  const [selectedTag, setSelectedTag] = useState('');

  const availableIcons = [
    { value: ['💡', '🚰', '🔥', '📶', '🛢️', '🔌', '📡', '💧', '⚡'], label: 'สารสาธารณูปโภค' },
    { value: ['🚗', '⛽', '🚙', '🅿️', '🚦', '🚘', '🛣️', '🚖', '🔧'], label: 'รถยนต์' },
    { value: ['💰', '📈', '🏦', '💳', '💵', '💸', '🧾', '💷', '💎'], label: 'การเงิน' },
    { value: ['👨‍👩‍👧‍👦', '🍼', '🎒', '🧸', '👶', '👧', '👦', '🏡', '👩‍🍼'], label: 'ครอบครัวและเด็ก' },
    { value: ['🛍️', '🎁', '👗', '👟', '💄', '⌚', '👒', '👜', '💍', '👕'], label: 'ช้อปปิ้ง' },
    { value: ['🍽️', '🍹', '🍔', '🍜', '🍕', '🥗', '🥩', '🍱', '🍩', '🍊'], label: 'อาหารและเครื่องดื่ม' },
    { value: ['🎓', '📚', '🖊️', '🏫', '📖', '✏️', '📒', '🧮', '🧑‍🏫', '📎'], label: 'การศึกษา' },
    { value: ['🎬', '🎵', '🎮', '📺', '🎤', '🎧', '🎨', '🎲', '🎷', '📸'], label: 'บันเทิง' },
    { value: ['🩺', '💊', '🏥', '🧘', '🥗', '🩹', '🧴', '⚕️', '🚑'], label: 'สุขภาพ' },
    { value: ['📦', '🧰', '📌', '🔑', '🗂️', '✂️', '📎', '🔨', '🧾'], label: 'เบ็ดเตล็ด' },
    { value: ['🏠', '🛋️', '🪑', '🚪', '🖼️', '🛏️', '🧹'], label: 'บ้าน' },
    { value: ['🐶', '🐱', '🐾', '🐟', '🦜', '🐇', '🐢', '🐕', '🐈', '🦎'], label: 'สัตว์เลี้ยง' },
    { value: ['🚌', '🚆', '🚲', '🚕', '🚤', '🚉', '🚄', '🚝', '🚍', '🛺'], label: 'การเดินทาง' },
    { value: ['✈️', '🗺️', '🏖️', '🏔️', '🛳️', '🛩️', '🏝️', '🛤️', '🗽', '🏯'], label: 'ท่องเที่ยว' },
    { value: ['🤲', '❤️', '🙏', '🎗️', '🕊️', '💝', '📦', '🍲', '💟'], label: 'บริจาค' },
    { value: ['🧴', '👕', '🩳', '👟', '🧼', '🧴', '💅', '🧢'], label: 'ของใช้ส่วนตัว' },
    { value: ['🏨', '🛏️', '🛎️', '🧳', '🚪', '🍽️', '🛋️', '🏩', '🛁'], label: 'ที่พักโรงแรม' },
    { value: ['🌳', '🌻', '🪴', '🌹', '🌿', '🍀', '🌲', '🌼', '🪵', '🌱'], label: 'จัดสวน' },
    { value: ['⚽', '🏀', '🏋️', '🏊', '🚴', '🎾', '🏐', '🥊', '⛳', '🏸'], label: 'กีฬา' },
    { value: ['💞', '💌', '🌹', '🥂', '💍', '👩‍❤️‍👨', '👩‍❤️‍👩', '👨‍❤️‍👨', '❤️', '😘'], label: 'เพื่อน-คนรัก' },
    { value: ['💻', '🖥️', '⌨️', '🖱️', '📱', '📡', '🤖', '💾', '🕹️', '🔋'], label: 'เทคโนโลยี/ดิจิทัล' },
    { value: ['💼', '🗂️', '📊', '📅', '🖊️', '📇', '📠', '🏢', '🧑‍💼', '🗃️'], label: 'งาน/อาชีพ' },
    { value: ['📸', '🎨', '🎭', '🎹', '🖌️', '🎤', '🎧', '🧵', '🎯', '📷'], label: 'ศิลปะ/งานสร้างสรรค์' },
    { value: ['🎂', '🎉', '🎊', '🎈', '🍰', '🥂', '🍾', '🎇', '🎆', '🍻'], label: 'งานเลี้ยง/เทศกาล' },
    { value: ['📖', '📰', '✏️', '📑', '📝', '📓', '📒', '📚', '📔', '🖋️'], label: 'การเรียนรู้/ศึกษาเพิ่มเติม' },
    { value: ['🧳', '🚖', '🚉', '🛫', '🛬', '🚢', '🚄', '🚲', '🚙', '🛣️'], label: 'โลจิสติกส์/การขนส่ง' },
    { value: ['💤', '🛌', '🛁', '🧼', '🪑', '🕯️', '🧖', '📺', '🎧'], label: 'การพักผ่อน' },
    { value: ['🧑‍🍳', '🥗', '🍱', '🥘', '🍲', '🍳', '🥩', '🥖', '🍜', '🍕'], label: 'ครัว/การปรุงอาหาร' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      setIsLoggedIn(true);
      fetchCategories(token);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'th-TH';
      recog.interimResults = true;
      recog.continuous = true;
      setRecognition(recog);
      setIsSpeechSupported(true);
    }
  }, []);

  const fetchCategories = async (token) => {
    try {
      const res = await fetch('https://balanz-ia.onrender.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        let updatedCategories = data || [];
        setCategories(updatedCategories);
        
        if (!formData.category) {
            const defaultCat = updatedCategories.find(cat => cat.type === formData.type) || updatedCategories[0];
            if (defaultCat) {
              setFormData(prev => ({ ...prev, category: defaultCat._id }));
            }
        }
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการดึงหมวดหมู่');
        setCategories([]);
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message);
      setCategories([]);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim()) {
      const isDuplicate = categories.some(
        (cat) =>
          cat.name.toLowerCase() === newCategory.trim().toLowerCase() &&
          cat.type === newCategoryType
      );
      if (!isDuplicate) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('https://balanz-ia.onrender.com/api/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newCategory.trim(), icon: selectedIcon, type: newCategoryType }),
          });
          const data = await res.json();
          if (res.ok) {
            await fetchCategories(token);
            setNewCategory('');
            setSelectedIcon('🍽️');
            setNewCategoryType('expense');
            setShowAddCategoryModal(false);
          } else {
            setError(data.message || 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
          }
        } catch (error) {
          setError('เกิดข้อผิดพลาด: ' + error.message);
        }
      } else {
        setError('หมวดหมู่นี้มีอยู่แล้วในประเภทนี้');
      }
    } else {
      setError('กรุณากรอกชื่อหมวดหมู่');
    }
  };

  const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    try {
      const budgetRes = await fetch('https://balanz-ia.onrender.com/api/budgets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const budgetData = await budgetRes.json();

      if (budgetRes.ok) {
        const isUsedInBudget = budgetData.some(
          budget => budget.category && String(budget.category._id) === String(categoryId)
        );

        if (isUsedInBudget) {
          setError(
            'ไม่สามารถลบหมวดหมู่ได้ เนื่องจากมีการใช้งานในระบบงบประมาณ'
          );
          return;
        }

        if (
          window.confirm(
            `คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${categories.find(cat => cat._id === categoryId)?.name}"? การลบจะรวมถึงการลบข้อมูลประวัติหมวดหมู่ในรายการธุรกรรมด้วย`
          )
        ) {
          const res = await fetch(`https://balanz-ia.onrender.com/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            await fetchCategories(token);
            if (formData.category === categoryId) {
              const remainingCategories = categories.filter(cat => cat.type === formData.type && cat._id !== categoryId);
              const newDefaultCat = remainingCategories[0];
              setFormData(prev => ({ ...prev, category: newDefaultCat?._id || '' }));
            }
          } else {
            const data = await res.json();
            setError(data.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
          }
        }
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const selectCategory = (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const startRecording = () => {
    if (!recognition) return;
    setIsRecording(true);
    setTranscript('');
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(transcript);
      parseTranscript(transcript);
    };
    recognition.onerror = (event) => {
      setError('เกิดข้อผิดพลาดในการบันทึกเสียง: ' + event.error);
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const parseTranscript = (text) => {
    const lowerText = text.toLowerCase();
    let newFormData = { ...formData };

    const amountMatch = lowerText.match(/(\d{1,3}(,\d{3})*(\.\d+)?)/);
    if (amountMatch) {
      const rawAmount = amountMatch[0].replace(/,/g, '');
      newFormData.amount = rawAmount;
    }

    if (lowerText.includes('รับ') || lowerText.includes('รายรับ')) {
      newFormData.type = 'income';
    } else if (lowerText.includes('จ่าย') || lowerText.includes('รายจ่าย')) {
      newFormData.type = 'expense';
    }

    const potentialCategory = categories.find(cat => 
        lowerText.includes(cat.name.toLowerCase()) && cat.type === newFormData.type
    );
    if (potentialCategory) {
        newFormData.category = potentialCategory._id;
    }

    const notesMatch = lowerText.match(/(หมายเหตุ|สำหรับ)\s*([\s\S]*)/);
    if (notesMatch) {
      newFormData.notes = notesMatch[2].trim();
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('กรุณากรอกจำนวนเงินที่มากกว่า 0');
      setLoading(false);
      return;
    }

    if (!formData.category) {
        setError('กรุณาเลือกหมวดหมู่');
        setLoading(false);
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (formData.date > today) {
      setError('วันที่ต้องไม่เกินวันปัจจุบัน');
      setLoading(false);
      return;
    }

    const transactionDate = new Date(`${formData.date}T00:00:00.000+07:00`);
    if (isNaN(transactionDate.getTime())) {
      setError(`รูปแบบวันที่ผิดพลาด กรุณาตรวจสอบ (ได้แก่ ${formData.date})`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://balanz-ia.onrender.com/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          date: formData.date,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
      }
      window.location.href = '/dashboard';
    } catch (error) {
      setError('เกิดข้อผิดพลาด: ' + error.message);
      console.error('Error details:', error);
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const selectedCategory = categories.find(cat => cat._id === formData.category);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex-1 w-full" style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#299D91]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#299D91] to-[#238A80] text-white">
            <h2 className="text-base font-bold">บันทึกรายรับ-รายจ่าย</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg flex items-start space-x-2 shadow-lg backdrop-blur-xl m-4">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1">
                <p className="text-xs font-medium text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form id="txn-form" onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <div className="p-1 bg-green-100 rounded">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span>จำนวนเงิน (บาท)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0" 
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value < 0 ? 0 : e.target.value, 
                    })
                  }
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] focus:border-transparent text-gray-700 text-base font-medium transition-all duration-200"
                  placeholder="เช่น 500"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 font-medium text-sm">฿</span>
                </div>
              </div>
            </div>

            {/* Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <div className="p-1 bg-blue-100 rounded">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>ประเภท</span>
              </label>
              <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`px-4 py-3 font-semibold transition-all duration-200 flex items-center space-x-1 ${
                    formData.type==='income' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span>รายรับ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`px-4 py-3 font-semibold transition-all duration-200 flex items-center space-x-1 ${
                    formData.type==='expense' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  <span>รายจ่าย</span>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <div className="p-1 bg-purple-100 rounded">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span>หมวดหมู่</span>
              </label>
              <CategoryPopup
                categories={categories}
                formData={formData}
                selectCategory={selectCategory}
                deleteCategory={deleteCategory}
                setShowAddCategoryModal={setShowAddCategoryModal}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <div className="p-1 bg-orange-100 rounded">
                  <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>วันที่</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] focus:border-transparent text-gray-700 text-base font-medium transition-all duration-200"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <div className="p-1 bg-indigo-100 rounded">
                  <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span>โน็ต (ถ้ามี)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] focus:border-transparent text-gray-700 text-base font-medium transition-all duration-200 resize-none"
                placeholder="เช่น ซื้ออาหารที่ร้าน ศศิ"
                rows="2"
              />
            </div>

            {/* Voice Recording */}
            {isSpeechSupported && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                  <div className="p-1 bg-cyan-100 rounded">
                    <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span>บันทึกด้วยเสียง</span>
                </label>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full p-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 text-white font-semibold shadow-lg ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform scale-105' 
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7.001 7.001 0 006 6.93V17a1 1 0 102 0v-2.07z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{isRecording ? 'หยุดการบันทึกเสียง' : 'บันทึกด้วยเสียง'}</span>
                </button>
                {transcript && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <p className="text-xs text-gray-700 font-medium">ข้อความที่บันทึก: {transcript}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#299D91] to-[#238A80] text-white rounded-lg hover:from-[#238A80] hover:to-[#1f7a72] transition-all duration-200 disabled:bg-gray-400 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">กำลังบันทึก...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>บันทึก</span>
                  </div>
                )}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center transition-all duration-200 font-semibold text-base border-2 border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>ยกเลิก</span>
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20"
          onClick={() => {
            setShowAddCategoryModal(false);
            setNewCategory('');
            setSelectedIcon('🍽️');
            setNewCategoryType('expense');
            setSelectedCategoryGroup('สารสาธารณูปโภค');
          }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">เพิ่มหมวดหมู่ใหม่</h3>
            <div className="space-y-6">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="ชื่อหมวดหมู่ใหม่"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] text-lg text-gray-700"
              />
              <select
                value={selectedCategoryGroup}
                onChange={(e) => setSelectedCategoryGroup(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] text-lg text-gray-700"
              >
                {availableIcons.map((group) => (
                  <option key={group.label} value={group.label}>
                    {group.label}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-6 gap-2 h-36 overflow-y-auto p-2 border rounded-lg">
                {availableIcons
                  .find((group) => group.label === selectedCategoryGroup)
                  ?.value.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      type="button"
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-3xl ${selectedIcon === icon ? 'bg-[#299D91] text-white' : 'bg-white hover:bg-gray-100'
                        } border border-gray-200 transition-colors shadow-sm`}
                    >
                      {icon}
                    </button>
                  ))}
              </div>
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] text-lg text-gray-700"
              >
                <option value="income">รายรับ</option>
                <option value="expense">รายจ่าย</option>
              </select>
            </div>
            <div className="flex space-x-6 mt-8">
              <button
                type="button"
                onClick={addCategory}
                className="flex-1 p-4 bg-[#299D91] text-white rounded-lg hover:bg-[#238A80] transition-colors text-lg font-medium"
              >
                ยืนยัน
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategory('');
                  setSelectedIcon('🍽️');
                  setNewCategoryType('expense');
                  setSelectedCategoryGroup('สารสาธารณูปโภค');
                }}
                className="flex-1 p-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg font-medium"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}