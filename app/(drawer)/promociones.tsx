import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';

export default function PromocionesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  const promos = [
    {
      id: 1,
      title: 'Martes de Pastas',
      desc: 'Disfruta de un 20% de descuento en todas nuestras pastas.',
      details: 'Válido solo los días martes en pedidos para llevar o delivery. No aplica con otras promociones. Descuento máximo de Bs 50.',
      date: 'Válido solo los martes',
      discount: '20% OFF',
      validDay: 2,
      image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Domingo de Lasaña',
      desc: 'Termina tu semana con nuestra deliciosa lasaña con 15% de descuento.',
      details: 'Válido todos los domingos. Aplica en todos los tamaños de lasaña de la casa.',
      date: 'Válido solo los domingos',
      discount: '15% OFF',
      validDay: 0,
      image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const handleOpenPromo = (promo: any) => {
    setSelectedPromo(promo);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Promociones" />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {promos.map((promo) => (
          <TouchableOpacity key={promo.id} style={styles.promoCard} activeOpacity={0.9} onPress={() => handleOpenPromo(promo)}>
            <View style={styles.promoImageContainer}>
              <Image source={{ uri: promo.image }} style={styles.promoImage} />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{promo.discount}</Text>
              </View>
            </View>
            <View style={styles.promoInfo}>
              <Text style={styles.promoTitle}>{promo.title}</Text>
              <Text style={styles.promoDesc}>{promo.desc}</Text>
              <View style={styles.promoFooter}>
                <Text style={styles.promoDate}>{promo.date}</Text>
                <Text style={styles.linkText}>Ver promoción</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Modal de Promoción */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPromo?.title}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </Pressable>
            </View>
            
            <Image source={{ uri: selectedPromo?.image }} style={styles.modalImage} />
            
            <Text style={styles.modalDesc}>{selectedPromo?.details}</Text>
            
            <CustomButton 
              title="APLICAR DESCUENTO" 
              onPress={() => {
                const today = new Date().getDay();
                if (selectedPromo?.validDay !== undefined && selectedPromo.validDay !== today) {
                  Alert.alert('No Disponible', 'Esta promoción no aplica el día de hoy. Por favor, revisa las condiciones.');
                  return;
                }
                setModalVisible(false);
                Alert.alert('¡Éxito!', `Descuento "${selectedPromo?.title}" aplicado a tu cuenta.`);
              }}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  promoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promoImageContainer: {
    height: 150,
    position: 'relative',
    backgroundColor: '#eee',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F39C12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  promoInfo: {
    padding: 16,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoDate: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  linkText: {
    color: '#D9381E',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDesc: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
